-- ============================================================
-- Multi-Branch Support
-- Created: 2026-10-08
-- Description: เพิ่มสาขา — machines + walk_in_queue ผูกผ่าน branch_id
--
-- DESIGN: เก็บ branch_id แค่ 2 ตาราง
--   - machines        = ต้นทางของทุกอย่าง (booking/session JOIN ผ่าน machine_id)
--   - walk_in_queue   = ต้องมีเพราะ preferred_machine_id เป็น NULL ได้
-- ตารางอื่น JOIN ผ่าน machine_id → ไม่ต้องแก้
--
-- RPC ที่รับ machine_id ตอนเขียน (create_booking, join_queue, start_session,
-- is_booking_slot_available) ไม่ต้องแก้ — conflict check scope ที่ machine อยู่แล้ว
-- ============================================================


-- ============================================================
-- 1. TABLE: branches
-- ============================================================

CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,           -- 'pattani' | 'narathiwas' (ใช้เป็น URL)
    name TEXT NOT NULL,                  -- 'สาขาปัตตานี' | 'Racing Game Station นราธิวาส'
    address TEXT,
    phone TEXT,
    opening_hours TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.branches IS 'สาขาของร้าน — ลูกค้าเลือกสาขาผ่าน URL slug';
COMMENT ON COLUMN public.branches.slug IS 'URL slug (pattani / narathiwas)';

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- สาขาเป็นข้อมูลสาธารณะ — ลูกค้าต้องเห็นเพื่อเลือก
CREATE POLICY "Branches are viewable by everyone"
    ON public.branches FOR SELECT
    USING (TRUE);

-- แก้ไขเฉพาะ admin/moderator
CREATE POLICY "Only admins/moderators can modify branches"
    ON public.branches FOR ALL
    USING (public.is_moderator_or_admin())
    WITH CHECK (public.is_moderator_or_admin());

CREATE INDEX IF NOT EXISTS idx_branches_slug ON public.branches(slug);
CREATE INDEX IF NOT EXISTS idx_branches_active ON public.branches(is_active) WHERE is_active = TRUE;

CREATE TRIGGER update_branches_updated_at
    BEFORE UPDATE ON public.branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 2. SEED: 2 สาขา
-- ============================================================

INSERT INTO public.branches (id, slug, name, address, phone, opening_hours, position)
VALUES
    ('00000000-0000-0000-0000-000000000b02', 'narathiwas', 'Racing Game Station นราธิวาส',
     'สาขานราธิวาส', NULL, 'เปิด 24 ชั่วโมง', 1),
    ('00000000-0000-0000-0000-000000000b01', 'pattani', 'Racing Game Station ปัตตานี',
     'สาขาปัตตานี', NULL, 'เปิด 24 ชั่วโมง', 2)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 3. ADD branch_id TO machines
-- ============================================================

ALTER TABLE public.machines
    ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE RESTRICT;

COMMENT ON COLUMN public.machines.branch_id IS 'สาขาที่เครื่องนี้อยู่ — ต้นทางของ booking/session';

-- Backfill: เครื่องทั้งหมดเดิม (ถ้ามี) → สาขานราธิวาส
-- ร้านเดิมอยู่ที่นราธิวาส (ดูหมายเหตุ "Gran Turismo Narathiwat" ใน booking.config.ts)
UPDATE public.machines SET branch_id = '00000000-0000-0000-0000-000000000b02'
WHERE branch_id IS NULL;

-- บังคับ: เครื่องต้องมีสาขาเสมอ
ALTER TABLE public.machines
    ALTER COLUMN branch_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_machines_branch ON public.machines(branch_id);
CREATE INDEX IF NOT EXISTS idx_machines_branch_active ON public.machines(branch_id, status) WHERE is_active = TRUE;


-- ============================================================
-- 4. ADD branch_id TO walk_in_queue
-- ============================================================

-- จำเป็น: preferred_machine_id เป็น NULL ได้ → ไม่มีทางรู้สาขาจาก machine
ALTER TABLE public.walk_in_queue
    ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE RESTRICT;

COMMENT ON COLUMN public.walk_in_queue.branch_id IS 'สาขาที่เข้าคิว — ต้องมีเพราะ preferred_machine_id เป็น NULL ได้';

UPDATE public.walk_in_queue
SET branch_id = COALESCE(
    (SELECT m.branch_id FROM public.machines m WHERE m.id = walk_in_queue.preferred_machine_id),
    '00000000-0000-0000-0000-000000000b02'
)
WHERE branch_id IS NULL;

ALTER TABLE public.walk_in_queue
    ALTER COLUMN branch_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_walk_in_queue_branch ON public.walk_in_queue(branch_id);
CREATE INDEX IF NOT EXISTS idx_walk_in_queue_branch_status ON public.walk_in_queue(branch_id, status);


-- ============================================================
-- 5. RPC: get_active_machines — filter ตามสาขา
-- ============================================================

-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_active_machines();

CREATE OR REPLACE FUNCTION public.rpc_get_active_machines(p_branch_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    machine_position INTEGER,
    status public.machine_status,
    is_active BOOLEAN,
    type TEXT,
    hourly_rate DECIMAL,
    branch_id UUID
) SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT
        m.id,
        m.name,
        m.description,
        m.position as machine_position,
        m.status,
        m.is_active,
        m.type,
        m.hourly_rate,
        m.branch_id
    FROM public.machines m
    WHERE m.is_active = TRUE
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id)
    ORDER BY m.position ASC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.rpc_get_active_machines(UUID) IS
    'เครื่องที่ active — p_branch_id NULL = ทั้งหมด (สำหรับ staff/admin)';

GRANT EXECUTE ON FUNCTION public.rpc_get_active_machines(UUID) TO anon, authenticated;


-- ============================================================
-- 6. RPC: get_bookings_by_date — filter ตามสาขา
-- ============================================================

-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_bookings_by_date(DATE, UUID);

CREATE OR REPLACE FUNCTION public.rpc_get_bookings_by_date(
    p_date DATE,
    p_customer_id UUID DEFAULT NULL,
    p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
    booking_id UUID, machine_id UUID, machine_name TEXT,
    customer_id UUID, customer_name TEXT, customer_phone TEXT,
    start_at TIMESTAMPTZ, end_at TIMESTAMPTZ,
    duration_minutes INTEGER, business_timezone TEXT, status TEXT,
    created_at TIMESTAMPTZ, local_date DATE, local_start_time TIME,
    local_end_time TIME, is_cross_midnight BOOLEAN, is_owner BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_admin BOOLEAN;
BEGIN
    v_is_admin := public.is_moderator_or_admin();

    RETURN QUERY
    SELECT
        b.id AS booking_id, b.machine_id, m.name AS machine_name,
        b.customer_id, c.name AS customer_name,
        CASE
            WHEN v_is_admin THEN c.phone
            WHEN p_customer_id IS NOT NULL AND b.customer_id = p_customer_id THEN c.phone
            ELSE NULL
        END AS customer_phone,
        b.start_at, b.end_at, b.duration_minutes, b.business_timezone,
        b.status::TEXT, b.created_at, b.local_date,
        b.local_start_time, b.local_end_time, b.is_cross_midnight,
        (p_customer_id IS NOT NULL AND b.customer_id = p_customer_id) as is_owner
    FROM bookings b
    JOIN machines m ON b.machine_id = m.id
    LEFT JOIN customers c ON b.customer_id = c.id
    WHERE (b.local_date = p_date OR (b.is_cross_midnight AND b.local_end_date = p_date))
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id)
    ORDER BY b.local_start_time ASC;
END;
$$;

COMMENT ON FUNCTION public.rpc_get_bookings_by_date(DATE, UUID, UUID) IS
    'booking ตามวัน — p_branch_id NULL = ทั้งหมด';

GRANT EXECUTE ON FUNCTION public.rpc_get_bookings_by_date(DATE, UUID, UUID) TO authenticated, service_role;


-- ============================================================
-- 7. RPC: get_waiting_queue — filter ตามสาขา
-- ============================================================

-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_waiting_queue();

CREATE OR REPLACE FUNCTION public.rpc_get_waiting_queue(p_branch_id UUID DEFAULT NULL)
RETURNS TABLE (
    queue_id UUID, queue_number INTEGER, customer_name TEXT,
    customer_phone_masked TEXT, party_size INTEGER,
    preferred_station_type TEXT, preferred_machine_name TEXT,
    status TEXT, joined_at TIMESTAMPTZ, wait_time_minutes INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        wq.id AS queue_id, wq.queue_number,
        c.name AS customer_name,
        public.mask_phone(c.phone) AS customer_phone_masked,
        wq.party_size, wq.preferred_station_type,
        m.name AS preferred_machine_name,
        wq.status::TEXT, wq.joined_at,
        EXTRACT(EPOCH FROM (NOW() - wq.joined_at))::INTEGER / 60 AS wait_time_minutes
    FROM public.walk_in_queue wq
    JOIN public.customers c ON c.id = wq.customer_id
    LEFT JOIN public.machines m ON m.id = wq.preferred_machine_id
    WHERE wq.status = 'waiting'
      AND (p_branch_id IS NULL OR wq.branch_id = p_branch_id)
    ORDER BY wq.queue_number ASC;
END;
$$;

COMMENT ON FUNCTION public.rpc_get_waiting_queue(UUID) IS
    'คิวที่กำลังรอ — p_branch_id NULL = ทั้งหมด';

GRANT EXECUTE ON FUNCTION public.rpc_get_waiting_queue(UUID) TO anon, authenticated;


-- ============================================================
-- 8. RPC: join_walk_in_queue — รับ branch_id ตอนเข้าคิว
-- ============================================================

-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error PGRST203 → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_join_walk_in_queue(TEXT, TEXT, INTEGER, TEXT, UUID, TEXT, UUID);

CREATE OR REPLACE FUNCTION public.rpc_join_walk_in_queue(
    p_customer_name TEXT, p_customer_phone TEXT,
    p_party_size INTEGER DEFAULT 1,
    p_preferred_station_type TEXT DEFAULT NULL,
    p_preferred_machine_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_customer_id UUID DEFAULT NULL,
    p_branch_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_customer_id UUID;
    v_queue_id UUID;
    v_queue_number INTEGER;
    v_branch_id UUID;
    v_existing_customer RECORD;
    v_current_profile_id UUID;
BEGIN
    p_customer_phone := TRIM(p_customer_phone);
    p_customer_name := TRIM(p_customer_name);

    PERFORM pg_advisory_xact_lock(hashtext('customer_creation_' || p_customer_phone));

    v_current_profile_id := public.get_active_profile_id();

    SELECT * INTO v_existing_customer FROM public.customers WHERE phone = p_customer_phone LIMIT 1;

    IF FOUND THEN
        IF v_existing_customer.profile_id IS NOT NULL THEN
            IF v_current_profile_id IS NULL OR v_current_profile_id != v_existing_customer.profile_id THEN
                RETURN json_build_object('success', false, 'error', 'เบอร์นี้ผูกกับบัญชีสมาชิก กรุณาเข้าสู่ระบบก่อนทำรายการ');
            END IF;
        END IF;

        IF p_customer_id IS NULL OR v_existing_customer.id != p_customer_id THEN
            RETURN json_build_object('success', false, 'error', 'เบอร์โทรศัพท์นี้ถูกลงทะเบียนแล้ว กรุณาตรวจสอบหรือแจ้งพนักงาน');
        END IF;

        v_customer_id := v_existing_customer.id;

        IF v_existing_customer.name != p_customer_name THEN
            UPDATE public.customers SET name = p_customer_name, updated_at = NOW() WHERE id = v_customer_id;
        END IF;
    ELSE
        INSERT INTO public.customers (name, phone, profile_id)
        VALUES (p_customer_name, p_customer_phone, v_current_profile_id)
        RETURNING id INTO v_customer_id;
    END IF;

    -- Resolve branch: ใช้ branch ของเครื่องที่เลือก ถ้าไม่ได้เลือกเครื่อง ใช้ค่าที่ส่งมา
    IF p_preferred_machine_id IS NOT NULL THEN
        SELECT branch_id INTO v_branch_id FROM public.machines WHERE id = p_preferred_machine_id;
        IF v_branch_id IS NULL THEN
            RETURN json_build_object('success', false, 'error', 'เครื่องที่เลือกไม่พบ');
        END IF;
    ELSE
        v_branch_id := COALESCE(p_branch_id, '00000000-0000-0000-0000-000000000b02');
    END IF;

    -- Queue number ต้องแยกตามสาขา (ไม่งั้นคิวสองสาขาโดนสัมผัส)
    SELECT COALESCE(MAX(queue_number), 0) + 1 INTO v_queue_number
    FROM public.walk_in_queue WHERE joined_at::DATE = CURRENT_DATE AND branch_id = v_branch_id;

    INSERT INTO public.walk_in_queue (
        customer_id, preferred_machine_id, branch_id, party_size,
        preferred_station_type, queue_number, notes
    ) VALUES (
        v_customer_id, p_preferred_machine_id, v_branch_id, p_party_size,
        p_preferred_station_type, v_queue_number, p_notes
    )
    RETURNING id INTO v_queue_id;

    RETURN json_build_object(
        'success', true,
        'queue', json_build_object(
            'id', v_queue_id, 'customerId', v_customer_id,
            'queueNumber', v_queue_number, 'partySize', p_party_size,
            'preferredStationType', p_preferred_station_type,
            'branchId', v_branch_id,
            'status', 'waiting', 'joinedAt', NOW()
        )
    );
END;
$$;

COMMENT ON FUNCTION public.rpc_join_walk_in_queue(TEXT, TEXT, INTEGER, TEXT, UUID, TEXT, UUID, UUID) IS
    'เข้าคิว walk-in — branch_id derive จากเครื่องที่เลือก หรือใช้ค่าที่ส่งมา';

GRANT EXECUTE ON FUNCTION public.rpc_join_walk_in_queue(TEXT, TEXT, INTEGER, TEXT, UUID, TEXT, UUID, UUID) TO anon, authenticated;


-- ============================================================
-- 9. RPC: get_my_walk_in_queue — คืน branch ให้ลูกค้าเช็ค
-- ============================================================

-- เปลี่ยน RETURNS TABLE (เพิ่ม branch_id) → CREATE OR REPLACE ทำไม่ได้
-- ต้อง DROP ก่อน (transaction เดียวกัน ถ้าพังจะ rollback ทั้งหมด)
DROP FUNCTION IF EXISTS public.rpc_get_my_walk_in_queue(UUID);

CREATE OR REPLACE FUNCTION public.rpc_get_my_walk_in_queue(p_customer_id UUID)
RETURNS TABLE (
    queue_id UUID, queue_number INTEGER, customer_name TEXT,
    customer_phone TEXT, party_size INTEGER, preferred_station_type TEXT,
    preferred_machine_name TEXT, notes TEXT, status TEXT,
    queues_ahead INTEGER, estimated_wait_minutes INTEGER,
    joined_at TIMESTAMPTZ, called_at TIMESTAMPTZ,
    branch_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        wq.id AS queue_id, wq.queue_number,
        c.name AS customer_name, c.phone AS customer_phone,
        wq.party_size, wq.preferred_station_type,
        m.name AS preferred_machine_name, wq.notes, wq.status::TEXT,
        (SELECT COUNT(*)::INTEGER FROM public.walk_in_queue wq2
         WHERE wq2.status = 'waiting' AND wq2.queue_number < wq.queue_number
           AND wq2.branch_id = wq.branch_id) AS queues_ahead,
        (SELECT COUNT(*)::INTEGER * 30 FROM public.walk_in_queue wq2
         WHERE wq2.status = 'waiting' AND wq2.queue_number < wq.queue_number
           AND wq2.branch_id = wq.branch_id) AS estimated_wait_minutes,
        wq.joined_at, wq.called_at, wq.branch_id
    FROM public.walk_in_queue wq
    JOIN public.customers c ON c.id = wq.customer_id
    LEFT JOIN public.machines m ON m.id = wq.preferred_machine_id
    WHERE wq.customer_id = p_customer_id
    ORDER BY wq.joined_at DESC
    LIMIT 1;
END;
$$;

COMMENT ON FUNCTION public.rpc_get_my_walk_in_queue(UUID) IS
    'คิวล่าสุดของลูกค้า — queues_ahead นับแยกสาขา';

GRANT EXECUTE ON FUNCTION public.rpc_get_my_walk_in_queue(UUID) TO anon, authenticated;


-- ============================================================
-- 10. RPC: get_active_sessions / get_today_sessions — filter ตามสาขา
-- ============================================================

-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_active_sessions();

CREATE OR REPLACE FUNCTION public.rpc_get_active_sessions(p_branch_id UUID DEFAULT NULL)
RETURNS TABLE (
    session_id UUID, station_id UUID, station_name TEXT,
    customer_name TEXT, start_time TIMESTAMPTZ,
    duration_minutes INTEGER, estimated_end_time TIMESTAMPTZ,
    source_type TEXT, payment_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id AS session_id, s.station_id, m.name AS station_name,
        s.customer_name, s.start_time,
        EXTRACT(EPOCH FROM (NOW() - s.start_time))::INTEGER / 60 AS duration_minutes,
        s.estimated_end_time,
        CASE
            WHEN s.booking_id IS NOT NULL THEN 'booking'
            WHEN s.queue_id IS NOT NULL THEN 'walk_in'
            ELSE 'manual'
        END AS source_type,
        s.payment_status::TEXT
    FROM public.sessions s
    JOIN public.machines m ON m.id = s.station_id
    WHERE s.end_time IS NULL
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id)
    ORDER BY s.start_time ASC;
END;
$$;

COMMENT ON FUNCTION public.rpc_get_active_sessions(UUID) IS
    'เซสชันที่กำลังเล่น — p_branch_id NULL = ทั้งหมด';

GRANT EXECUTE ON FUNCTION public.rpc_get_active_sessions(UUID) TO anon, authenticated;


-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_today_sessions();

CREATE OR REPLACE FUNCTION public.rpc_get_today_sessions(p_branch_id UUID DEFAULT NULL)
RETURNS TABLE (
    session_id UUID, station_id UUID, station_name TEXT,
    customer_name TEXT, start_time TIMESTAMPTZ, end_time TIMESTAMPTZ,
    duration_minutes INTEGER, total_amount DECIMAL,
    payment_status TEXT, source_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id AS session_id, s.station_id, m.name AS station_name,
        s.customer_name, s.start_time, s.end_time,
        CASE
            WHEN s.end_time IS NOT NULL
            THEN EXTRACT(EPOCH FROM (s.end_time - s.start_time))::INTEGER / 60
            ELSE EXTRACT(EPOCH FROM (NOW() - s.start_time))::INTEGER / 60
        END AS duration_minutes,
        s.total_amount, s.payment_status::TEXT,
        CASE
            WHEN s.booking_id IS NOT NULL THEN 'booking'
            WHEN s.queue_id IS NOT NULL THEN 'walk_in'
            ELSE 'manual'
        END AS source_type
    FROM public.sessions s
    JOIN public.machines m ON m.id = s.station_id
    WHERE s.start_time::DATE = CURRENT_DATE
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id)
    ORDER BY s.start_time DESC;
END;
$$;

COMMENT ON FUNCTION public.rpc_get_today_sessions(UUID) IS
    'เซสชันวันนี้ — p_branch_id NULL = ทั้งหมด';

GRANT EXECUTE ON FUNCTION public.rpc_get_today_sessions(UUID) TO authenticated;


-- ============================================================
-- 11. RPC: get_walk_in_queue_stats / get_session_stats / get_backend_stats
-- ============================================================

-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_walk_in_queue_stats();

CREATE OR REPLACE FUNCTION public.rpc_get_walk_in_queue_stats(p_branch_id UUID DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_waiting_count INTEGER; v_called_count INTEGER;
    v_seated_today INTEGER; v_cancelled_today INTEGER;
    v_avg_wait_minutes INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_waiting_count FROM public.walk_in_queue WHERE status = 'waiting' AND (p_branch_id IS NULL OR branch_id = p_branch_id);
    SELECT COUNT(*) INTO v_called_count FROM public.walk_in_queue WHERE status = 'called' AND (p_branch_id IS NULL OR branch_id = p_branch_id);
    SELECT COUNT(*) INTO v_seated_today FROM public.walk_in_queue WHERE status = 'seated' AND seated_at::DATE = CURRENT_DATE AND (p_branch_id IS NULL OR branch_id = p_branch_id);
    SELECT COUNT(*) INTO v_cancelled_today FROM public.walk_in_queue WHERE status = 'cancelled' AND updated_at::DATE = CURRENT_DATE AND (p_branch_id IS NULL OR branch_id = p_branch_id);

    SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (seated_at - joined_at)) / 60), 0)::INTEGER
    INTO v_avg_wait_minutes FROM public.walk_in_queue WHERE status = 'seated' AND seated_at::DATE = CURRENT_DATE AND (p_branch_id IS NULL OR branch_id = p_branch_id);

    RETURN json_build_object(
        'waitingCount', v_waiting_count, 'calledCount', v_called_count,
        'seatedToday', v_seated_today, 'cancelledToday', v_cancelled_today,
        'averageWaitMinutes', v_avg_wait_minutes
    );
END;
$$;

COMMENT ON FUNCTION public.rpc_get_walk_in_queue_stats(UUID) IS
    'สถิติคิววันนี้ — p_branch_id NULL = ทั้งหมด';

GRANT EXECUTE ON FUNCTION public.rpc_get_walk_in_queue_stats(UUID) TO anon, authenticated;


-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_session_stats(DATE, DATE);

CREATE OR REPLACE FUNCTION public.rpc_get_session_stats(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_branch_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_start DATE := COALESCE(p_start_date, CURRENT_DATE);
    v_end DATE := COALESCE(p_end_date, CURRENT_DATE);
    v_total_sessions INTEGER; v_active_sessions INTEGER;
    v_completed_sessions INTEGER; v_total_revenue DECIMAL;
    v_paid_revenue DECIMAL; v_unpaid_revenue DECIMAL;
    v_avg_duration INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_total_sessions FROM public.sessions s JOIN public.machines m ON m.id = s.station_id WHERE s.start_time::DATE BETWEEN v_start AND v_end AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);
    SELECT COUNT(*) INTO v_active_sessions FROM public.sessions s JOIN public.machines m ON m.id = s.station_id WHERE s.end_time IS NULL AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);
    SELECT COUNT(*) INTO v_completed_sessions FROM public.sessions s JOIN public.machines m ON m.id = s.station_id WHERE s.end_time IS NOT NULL AND s.start_time::DATE BETWEEN v_start AND v_end AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);
    SELECT COALESCE(SUM(s.total_amount), 0) INTO v_total_revenue FROM public.sessions s JOIN public.machines m ON m.id = s.station_id WHERE s.start_time::DATE BETWEEN v_start AND v_end AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);
    SELECT COALESCE(SUM(s.total_amount), 0) INTO v_paid_revenue FROM public.sessions s JOIN public.machines m ON m.id = s.station_id WHERE s.payment_status = 'paid' AND s.start_time::DATE BETWEEN v_start AND v_end AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);
    SELECT COALESCE(SUM(s.total_amount), 0) INTO v_unpaid_revenue FROM public.sessions s JOIN public.machines m ON m.id = s.station_id WHERE s.payment_status = 'unpaid' AND s.end_time IS NOT NULL AND s.start_time::DATE BETWEEN v_start AND v_end AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);
    SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (s.end_time - s.start_time)) / 60), 0)::INTEGER INTO v_avg_duration FROM public.sessions s JOIN public.machines m ON m.id = s.station_id WHERE s.end_time IS NOT NULL AND s.start_time::DATE BETWEEN v_start AND v_end AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);

    RETURN json_build_object(
        'totalSessions', v_total_sessions, 'activeSessions', v_active_sessions,
        'completedSessions', v_completed_sessions, 'totalRevenue', v_total_revenue,
        'paidRevenue', v_paid_revenue, 'unpaidRevenue', v_unpaid_revenue,
        'averageDurationMinutes', v_avg_duration,
        'dateRange', json_build_object('start', v_start, 'end', v_end)
    );
END;
$$;

COMMENT ON FUNCTION public.rpc_get_session_stats(DATE, DATE, UUID) IS
    'สถิติเซสชัน — p_branch_id NULL = ทั้งหมด';

GRANT EXECUTE ON FUNCTION public.rpc_get_session_stats(DATE, DATE, UUID) TO authenticated;


-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_backend_stats();

CREATE OR REPLACE FUNCTION public.rpc_get_backend_stats(p_branch_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_machine_stats RECORD;
    v_queue_stats RECORD;
    v_session_stats RECORD;
    v_booking_stats RECORD;
BEGIN
    -- Machine stats
    SELECT
        COUNT(*)::INTEGER AS total,
        COUNT(*) FILTER (WHERE status = 'available' AND is_active)::INTEGER AS available,
        COUNT(*) FILTER (WHERE status = 'occupied' AND is_active)::INTEGER AS occupied,
        COUNT(*) FILTER (WHERE status = 'maintenance')::INTEGER AS maintenance
    INTO v_machine_stats FROM public.machines WHERE (p_branch_id IS NULL OR branch_id = p_branch_id);

    -- Walk-in queue stats
    SELECT
        COUNT(*) FILTER (WHERE status = 'waiting')::INTEGER AS waiting,
        COUNT(*) FILTER (WHERE status = 'called')::INTEGER AS called,
        COUNT(*) FILTER (WHERE status = 'seated' AND seated_at::DATE = CURRENT_DATE)::INTEGER AS seated_today,
        COUNT(*) FILTER (WHERE status = 'cancelled' AND updated_at::DATE = CURRENT_DATE)::INTEGER AS cancelled_today
    INTO v_queue_stats FROM public.walk_in_queue WHERE (p_branch_id IS NULL OR branch_id = p_branch_id);

    -- Session stats
    SELECT
        COUNT(*)::INTEGER AS total_today,
        COUNT(*) FILTER (WHERE end_time IS NULL)::INTEGER AS active,
        COALESCE(SUM(total_amount), 0)::DECIMAL AS revenue_today
    INTO v_session_stats FROM public.sessions s JOIN public.machines m ON m.id = s.station_id
    WHERE s.start_time::DATE = CURRENT_DATE AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);

    -- Booking stats
    SELECT
        COUNT(*) FILTER (WHERE b.status = 'confirmed')::INTEGER AS confirmed,
        COUNT(*) FILTER (WHERE b.status = 'checked_in')::INTEGER AS checked_in,
        COUNT(*) FILTER (WHERE b.status = 'completed' AND b.local_date = CURRENT_DATE)::INTEGER AS completed_today
    INTO v_booking_stats FROM public.bookings b JOIN public.machines m ON m.id = b.machine_id
    WHERE (b.local_date = CURRENT_DATE OR b.status IN ('confirmed', 'checked_in'))
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);

    RETURN json_build_object(
        'machines', json_build_object(
            'total', v_machine_stats.total, 'available', v_machine_stats.available,
            'occupied', v_machine_stats.occupied, 'maintenance', v_machine_stats.maintenance
        ),
        'walkInQueue', json_build_object(
            'waiting', v_queue_stats.waiting, 'called', v_queue_stats.called,
            'seatedToday', v_queue_stats.seated_today, 'cancelledToday', v_queue_stats.cancelled_today
        ),
        'sessions', json_build_object(
            'totalToday', v_session_stats.total_today, 'active', v_session_stats.active,
            'revenueToday', v_session_stats.revenue_today
        ),
        'bookings', json_build_object(
            'confirmed', v_booking_stats.confirmed, 'checkedIn', v_booking_stats.checked_in,
            'completedToday', v_booking_stats.completed_today
        )
    );
END;
$$;

COMMENT ON FUNCTION public.rpc_get_backend_stats(UUID) IS
    'สถิติ backend — p_branch_id NULL = ทั้งหมด';

GRANT EXECUTE ON FUNCTION public.rpc_get_backend_stats(UUID) TO authenticated;

-- ============================================================
-- 12. RPC: get_home_dashboard_stats — นับแยกสาขา
-- ============================================================

-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → CREATE OR REPLACE จะกลายเป็น overload
-- PostgREST เจอ 2 ตัวแล้ว error → ต้อง DROP ตัวเก่าทิ้ง (transaction เดียวกัน)
DROP FUNCTION IF EXISTS public.rpc_get_home_dashboard_stats(DATE);

CREATE OR REPLACE FUNCTION public.rpc_get_home_dashboard_stats(
    p_date DATE DEFAULT CURRENT_DATE,
    p_branch_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_today_bookings INTEGER;
    v_walk_in_queue_count INTEGER;
    v_general_customers INTEGER;
    v_total_players INTEGER;
BEGIN
    -- 1. Bookings Today
    SELECT COUNT(*) INTO v_today_bookings
    FROM public.bookings b
    JOIN public.machines m ON m.id = b.machine_id
    WHERE b.local_date = p_date
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);

    -- 2. Walk-in Queue created today
    SELECT COUNT(*) INTO v_walk_in_queue_count
    FROM public.walk_in_queue
    WHERE (joined_at AT TIME ZONE 'Asia/Bangkok')::DATE = p_date
      AND (p_branch_id IS NULL OR branch_id = p_branch_id);

    -- 3. General Customers (sessions today without booking_id and queue_id)
    SELECT COUNT(*) INTO v_general_customers
    FROM public.sessions s
    JOIN public.machines m ON m.id = s.station_id
    WHERE (s.start_time AT TIME ZONE 'Asia/Bangkok')::DATE = p_date
      AND s.booking_id IS NULL
      AND s.queue_id IS NULL
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);

    -- 4. Total Players Today
    SELECT COUNT(*) INTO v_total_players
    FROM public.sessions s
    JOIN public.machines m ON m.id = s.station_id
    WHERE (s.start_time AT TIME ZONE 'Asia/Bangkok')::DATE = p_date
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id);

    RETURN json_build_object(
        'todayBookings', COALESCE(v_today_bookings, 0),
        'walkInQueue', COALESCE(v_walk_in_queue_count, 0),
        'generalCustomers', COALESCE(v_general_customers, 0),
        'totalPlayers', COALESCE(v_total_players, 0)
    );
END;
$$;

COMMENT ON FUNCTION public.rpc_get_home_dashboard_stats(DATE, UUID) IS
    'สถิติหน้าแรก — p_branch_id NULL = ทั้งหมด';

GRANT EXECUTE ON FUNCTION public.rpc_get_home_dashboard_stats(DATE, UUID) TO anon, authenticated;


-- ============================================================
-- 13. RPC: get_branches — ลูกค้าเลือกสาขา
-- ============================================================

CREATE OR REPLACE FUNCTION public.rpc_get_branches()
RETURNS TABLE (
    id UUID,
    slug TEXT,
    name TEXT,
    address TEXT,
    phone TEXT,
    opening_hours TEXT,
    branch_position INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT b.id, b.slug, b.name, b.address, b.phone, b.opening_hours, b.position AS branch_position
    FROM public.branches b
    WHERE b.is_active = TRUE
    ORDER BY b.position ASC;
END;
$$;

COMMENT ON FUNCTION public.rpc_get_branches() IS
    'รายชื่อสาขาที่เปิดอยู่ — ใช้แสดงในหน้าเลือกสาขา';

GRANT EXECUTE ON FUNCTION public.rpc_get_branches() TO anon, authenticated;


-- ============================================================
-- 14. RPC: get_my_bookings — กรองตามสาขา
-- ============================================================

-- signature เปลี่ยน (เพิ่มพารามิเตอร์) → PostgREST จะเจอ 2 ตัวแล้ว error PGRST203
DROP FUNCTION IF EXISTS public.rpc_get_my_bookings(UUID);

CREATE OR REPLACE FUNCTION public.rpc_get_my_bookings(
    p_customer_id UUID,
    p_branch_id UUID DEFAULT NULL
)
RETURNS TABLE (
    booking_id UUID, machine_id UUID, machine_name TEXT,
    customer_name TEXT, customer_phone TEXT,
    start_at TIMESTAMPTZ, end_at TIMESTAMPTZ,
    local_date DATE, local_start_time TIME, local_end_time TIME,
    duration_minutes INTEGER, business_timezone TEXT,
    is_cross_midnight BOOLEAN, status TEXT, total_price DECIMAL, created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id AS booking_id, b.machine_id, m.name AS machine_name,
        c.name AS customer_name, c.phone AS customer_phone,
        b.start_at, b.end_at, b.local_date, b.local_start_time, b.local_end_time,
        b.duration_minutes, b.business_timezone, b.is_cross_midnight,
        b.status::TEXT, b.total_price, b.created_at
    FROM public.bookings b
    JOIN public.customers c ON c.id = b.customer_id
    JOIN public.machines m ON m.id = b.machine_id
    WHERE b.customer_id = p_customer_id
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id)
    ORDER BY b.start_at DESC
    LIMIT 50;
END;
$$;

COMMENT ON FUNCTION public.rpc_get_my_bookings(UUID, UUID) IS
    'ประวัติจองของลูกค้า — p_branch_id NULL = ทุกสาขา';

GRANT EXECUTE ON FUNCTION public.rpc_get_my_bookings(UUID, UUID) TO anon, authenticated;
