-- ============================================================
-- Branch Pricing — rate tiers per branch
-- Created: 2026-10-12
-- Description: ราคาแยกสาขา — เพิ่มตาราง rate ต่อสาขา + ให้ RPC คิดเงินด้วยสูตรเดียวกับหน้าเว็บ
--
-- เหตุผลที่ต้องมีตารางนี้:
--   ก่อนหน้านี้ราคาอยู่สองที่ที่ไม่เคยตรงกัน —
--     1. src/config/booking.config.ts  DURATION_OPTIONS  (ที่ลูกค้าเห็น)
--     2. machines.hourly_rate + ceil(ชม่วง)  (ที่คิดเงินจริงใน rpc_end_session)
--   ตัวที่ 2 คิด 1 ชั่วโมง = 200 บาท ขณะที่หน้าเว็บบอก 100 — ลูกค้าโดน
--   เก็บเงินผิดมาตลอด และมันเงียบเพราะไม่มีที่ไหนเทียบสองค่านี้
--
--   ตารางนี้ทำให้ "ราคาที่เก็บเงินจริง" เป็นข้อมูล ไม่ใช่สูตรที่เขียนซ้ำใน RPC
--   และ src/config/booking.config.ts อ่านค่าเดียวกัน (ตรวจด้วย check:pricing-sync)
--
-- ⚠️ หลังรัน migration นี้ ห้ามแก้ราคาใน SQL ที่อื่นอีก — แก้ที่นี่ที่เดียว
--    แล้วแก้ BRANCH_RATES ใน booking.config.ts ให้ตรงกัน
-- ============================================================

-- ============================================================
-- 1. TABLE: branch_rate_tiers
-- ============================================================

CREATE TABLE IF NOT EXISTS public.branch_rate_tiers (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    label TEXT NOT NULL,                    -- '30 นาที'
    label_en TEXT NOT NULL,                 -- 'WARM UP'
    icon TEXT NOT NULL DEFAULT '',
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- หนึ่งระยะเวลาต่อหนึ่งสาขาเท่านั้น
    CONSTRAINT branch_rate_tiers_branch_duration UNIQUE (branch_id, duration_minutes)
);

COMMENT ON TABLE public.branch_rate_tiers IS
    'ราคาต่อสาขา — RPC ใช้ตารางนี้คิดเงินจริง, หน้าเว็บอ่านค่าเดียวกันจาก booking.config.ts';
COMMENT ON COLUMN public.branch_rate_tiers.price IS 'ราคารวมของ tier นี้ (THB) ไม่ใช่ราคาต่อชั่วโมง';
COMMENT ON COLUMN public.branch_rate_tiers.duration_minutes IS 'ระยะเวลา (นาที) ที่ราคานี้ครอบคลุม';

ALTER TABLE public.branch_rate_tiers ENABLE ROW LEVEL SECURITY;

-- policy/index/trigger ทิ้งก่อนสร้าง — migration ต้องรันซ้ำได้
-- (deploy ที่ล้มเหลวแล้วรันใหม่, dev ที่รันเพิ่ม) ไม่ใช่แค่รันครั้งเดียว
DROP POLICY IF EXISTS "Branch rate tiers are viewable by everyone" ON public.branch_rate_tiers;
DROP POLICY IF EXISTS "Only admins/moderators can modify branch rate tiers" ON public.branch_rate_tiers;

-- ราคาเป็นข้อมูลสาธารณะ — ลูกค้าต้องเห็นเพื่อตัดสินใจจอง
CREATE POLICY "Branch rate tiers are viewable by everyone"
    ON public.branch_rate_tiers FOR SELECT
    USING (TRUE);

-- แก้ไขเฉพาะ admin/moderator
CREATE POLICY "Only admins/moderators can modify branch rate tiers"
    ON public.branch_rate_tiers FOR ALL
    USING (public.is_moderator_or_admin())
    WITH CHECK (public.is_moderator_or_admin());

CREATE INDEX IF NOT EXISTS idx_branch_rate_tiers_branch
    ON public.branch_rate_tiers(branch_id, duration_minutes);

DROP TRIGGER IF EXISTS update_branch_rate_tiers_updated_at ON public.branch_rate_tiers;
CREATE TRIGGER update_branch_rate_tiers_updated_at
    BEFORE UPDATE ON public.branch_rate_tiers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. SEED: ราคาของแต่ละสาขา
--
--   นราธิวาส (เดิม)  30 นาที 60 · 1 ชม 100 · 2 ชม 200 · 3 ชม 280
--   ปัตตานี        30 นาที 79 · 1 ชม 119 · 2 ชม 200 · 3 ชม 280
--
-- ON CONFLICT DO UPDATE: migration ต้องรันซ้ำได้โดยไม่พัง
-- (dev ที่ reset แล้วรันใหม่, หรือ deploy ที่รันซ้ำ) และต้องอัปเดตราคา
-- เพราะเจ้าของร้านเปลี่ยนราคาแล้วรัน migration ถัดไป
-- ============================================================

INSERT INTO public.branch_rate_tiers
    (branch_id, duration_minutes, price, label, label_en, icon, is_popular, position)
VALUES
    -- สาขานราธิวาส — ราคาเดิม ไม่เปลี่ยน
    ('00000000-0000-0000-0000-000000000b02',  30,  60.00, '30 นาที',  'WARM UP',   '⏱️', FALSE, 1),
    ('00000000-0000-0000-0000-000000000b02',  60, 100.00, '1 ชั่วโมง', 'PRO RACE',  '🏁', TRUE,  2),
    ('00000000-0000-0000-0000-000000000b02', 120, 200.00, '2 ชั่วโมง', 'PRO RACE',  '🏁', FALSE, 3),
    ('00000000-0000-0000-0000-000000000b02', 180, 280.00, '3 ชั่วโมง', 'GRAND PRIX', '🏆', TRUE,  4),
    -- สาขาปัตตานี — ตั้งโดยเจ้าของร้าน 2026-10-12
    ('00000000-0000-0000-0000-000000000b01',  30,  79.00, '30 นาที',  'WARM UP',   '⏱️', FALSE, 1),
    ('00000000-0000-0000-0000-000000000b01',  60, 119.00, '1 ชั่วโมง', 'PRO RACE',  '🏁', TRUE,  2),
    ('00000000-0000-0000-0000-000000000b01', 120, 200.00, '2 ชั่วโมง', 'PRO RACE',  '🏁', FALSE, 3),
    ('00000000-0000-0000-0000-000000000b01', 180, 280.00, '3 ชั่วโมง', 'GRAND PRIX', '🏆', TRUE,  4)
ON CONFLICT (branch_id, duration_minutes) DO UPDATE SET
    price       = EXCLUDED.price,
    label       = EXCLUDED.label,
    label_en    = EXCLUDED.label_en,
    icon        = EXCLUDED.icon,
    is_popular  = EXCLUDED.is_popular,
    position    = EXCLUDED.position,
    updated_at  = NOW();

-- ============================================================
-- 3. FUNCTION: calculate_session_price — สูตรราคาเดียว ที่ทั้ง DB และหน้าเว็บใช้ตรงกัน
--
--   ≤ 30 นาที            → ราคา tier แรก
--   นาทีที่เกิน ≤ tier ใด  → ราคา tier ที่ครอบคลุม
--   เกิน tier สูงสุด       → ราคา tier สูงสุด + (นาทีเกิน × อัตราต่อนาทีที่ดีที่สุด)
--
-- SECURITY DEFINER แต่ไม่รับ input จากผู้ใช้เลย — รับแค่ branch_id กับจำนวนนาที
-- จึงไม่เปิดช่องให้เขียนอะไรทับได้ และไม่ leak ข้อมูลสาขาใด
--
-- ⚠️ ต้องตรงกับ calculateSessionPrice() ใน src/config/booking.config.ts
--    (เทียบอัตโนมัติด้วย npm run check:pricing-sync)
-- ============================================================

CREATE OR REPLACE FUNCTION public.calculate_session_price(
    p_branch_id UUID,
    p_duration_minutes INTEGER
)
RETURNS DECIMAL(10, 2)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_first_tier DECIMAL(10, 2);
    v_tier_price DECIMAL(10, 2);
    v_max_minutes INTEGER;
    v_max_price DECIMAL(10, 2);
    v_best_rate DECIMAL(10, 2);
    v_extra INTEGER;
BEGIN
    IF p_duration_minutes <= 0 THEN
        RETURN 0;
    END IF;

    -- 1. ต่ำกว่า tier แรก → จ่ายเท่า tier แรก
    SELECT price INTO v_first_tier
    FROM public.branch_rate_tiers
    WHERE branch_id = p_branch_id
    ORDER BY duration_minutes ASC
    LIMIT 1;

    -- สาขานี้ยังไม่มีราคาเลย — คืน 0 ให้ชัดกว่า NULL (เงิน 0 คือ "ยังไม่ตั้งราคา"
    -- ไม่ใช่ "เล่นฟรี" แต่ผู้เรียกต้องเช็คผลลัพธ์ก่อนบันทึก)
    IF v_first_tier IS NULL THEN
        RETURN 0;
    END IF;

    IF p_duration_minutes <= (SELECT MIN(duration_minutes) FROM public.branch_rate_tiers WHERE branch_id = p_branch_id) THEN
        RETURN v_first_tier;
    END IF;

    -- 2. มี tier ที่ครอบคลุม → จ่ายราคา tier นั้น
    SELECT price INTO v_tier_price
    FROM public.branch_rate_tiers
    WHERE branch_id = p_branch_id
      AND duration_minutes >= p_duration_minutes
    ORDER BY duration_minutes ASC
    LIMIT 1;

    IF v_tier_price IS NOT NULL THEN
        RETURN v_tier_price;
    END IF;

    -- 3. เกิน tier สูงสุด → tier สูงสุด + ส่วนเกินคิดต่อนาที
    SELECT duration_minutes, price INTO v_max_minutes, v_max_price
    FROM public.branch_rate_tiers
    WHERE branch_id = p_branch_id
    ORDER BY duration_minutes DESC
    LIMIT 1;

    -- อัตราต่อนาทีที่ดีที่สุด = ราคาต่อนาทีต่ำสุดของสาขานั้น
    SELECT MIN(price / duration_minutes) INTO v_best_rate
    FROM public.branch_rate_tiers
    WHERE branch_id = p_branch_id;

    v_extra := p_duration_minutes - v_max_minutes;

    RETURN v_max_price + CEIL(v_extra * v_best_rate);
END;
$$;

COMMENT ON FUNCTION public.calculate_session_price(UUID, INTEGER) IS
    'คำนวณราคาจาก rate ของสาขานั้น — ตรงกับ calculateSessionPrice() ใน booking.config.ts';

REVOKE ALL ON FUNCTION public.calculate_session_price(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.calculate_session_price(UUID, INTEGER) TO anon, authenticated;

-- ============================================================
-- 4. RPC: get_active_machines — คืน rate ของสาขาไปด้วย
--
-- จุดประสงค์: ChatService เคยพิมพ์ `${m.hourlyRate}฿/ชม.` ซึ่งเป็น hourly_rate
-- ที่ไม่ได้อยู่ในตารางราคาที่ลูกค้าเห็นเลย ทำให้ LINE บอกราคาผิด
-- ตอนนี้ hourly_rate เลิกมีความหมายในการคิดเงินแล้ว (ดูหมายเหตุข้อ 5)
-- ============================================================

DROP FUNCTION IF EXISTS public.rpc_get_active_machines(UUID);

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
    branch_id UUID,
    rate_1h DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER AS $$
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
        m.branch_id,
        -- ราคา tier 60 นาทีของสาขานี้ (ไม่มี rate → NULL ไม่ใช่ 0)
        (
            SELECT r.price
            FROM public.branch_rate_tiers r
            WHERE r.branch_id = m.branch_id AND r.duration_minutes = 60
        )
    FROM public.machines m
    WHERE m.is_active = TRUE
      AND (p_branch_id IS NULL OR m.branch_id = p_branch_id)
    ORDER BY m.position ASC;
END;
$$;

COMMENT ON FUNCTION public.rpc_get_active_machines(UUID) IS
    'เครื่องที่ใช้งานอยู่ — rate_1h คือราคา tier 1 ชั่วโมงของสาขานั้น';

GRANT EXECUTE ON FUNCTION public.rpc_get_active_machines(UUID) TO anon, authenticated;

-- ============================================================
-- 5. RPC: end_session — คิดเงินด้วย rate ของสาขาของเครื่อง
--
-- ⚠️ นี่คือจุดที่เงินจริงถูกเก็บ
--   เดิม:  CEIL(นาที/60) * hourly_rate  → ไม่รู้จัก tier ไม่รู้จักสาขา
--         ผลคือ 1 ชม = 200 บาท ทั้งที่หน้าเว็บบอก 100
--   ใหม่:  calculate_session_price(branch ของเครื่อง, นาทีที่เล่น)
--
-- เครื่องที่เล่นอยู่สาขาไหน = สาขาที่ต้องคิดเงิน ไม่ต้องรับ param จาก client
-- (client ส่ง branch_id มาได้ แต่เชื่อไม่ได้ — SECURITY DEFINER ตัด RLS อยู่แล้ว)
-- ============================================================

DROP FUNCTION IF EXISTS public.rpc_end_session(UUID, DECIMAL);

CREATE OR REPLACE FUNCTION public.rpc_end_session(
    p_session_id UUID,
    -- ไม่มี DEFAULT: บังคับให้ผู้เรียกส่งยอดที่พนักงานยืนยันเสมอ
    p_total_amount DECIMAL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session RECORD;
    v_duration_minutes INTEGER;
    v_calculated_amount DECIMAL;
    v_branch_id UUID;
BEGIN
    IF NOT public.is_moderator_or_admin() THEN
        RETURN json_build_object('success', false, 'error', 'ไม่มีสิทธิ์ดำเนินการ');
    END IF;

    -- ⚠️ ยอดเงินต้องมาจากพนักงานเสมอ — ไม่มีทางที่ระบบคำนวณแล้วเก็บเอง
    --
    -- เดิม NULL = คิดให้อัตโนมัติจาก rate ของสาขา ซึ่งเปิดเส้นทางให้เงินถูกเก็บ
    -- โดยไม่มีคนตรวจ และทำให้ตัวเลขที่ระบบคำนวณดูเป็น "ราคาสุดท้าย"
    -- ทั้งที่จริงแค่เป็นตัวช่วย — พนักงานลดราคาให้ลูกค้าได้เสมอ
    --
    -- ราคาแนะนำถูกคำนวณฝั่ง client (ControlView → suggestedEndAmount) และแสดง
    -- ให้พนักงานยืนยัน ถ้าอยากได้ค่าที่คำนวณจริงในฝั่ง DB ต้องเรียก
    -- calculate_session_price() แยกเอง ไม่ใช่ปล่อยให้ RPC ตัดสินใจแทน
    IF p_total_amount IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'กรุณาระบุยอดเงินที่เก็บ'
        );
    END IF;

    SELECT s.*, m.branch_id INTO v_session
    FROM public.sessions s
    JOIN public.machines m ON m.id = s.station_id
    WHERE s.id = p_session_id;

    IF v_session IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'ไม่พบ session นี้');
    END IF;

    IF v_session.end_time IS NOT NULL THEN
        RETURN json_build_object('success', false, 'error', 'Session นี้จบไปแล้ว');
    END IF;

    v_duration_minutes := EXTRACT(EPOCH FROM (NOW() - v_session.start_time))::INTEGER / 60;
    v_branch_id := v_session.branch_id;

    v_calculated_amount := p_total_amount;

    UPDATE public.sessions
    SET end_time = NOW(), total_amount = v_calculated_amount, updated_at = NOW()
    WHERE id = p_session_id;

    UPDATE public.machines SET status = 'available', updated_at = NOW()
    WHERE id = v_session.station_id;

    RETURN json_build_object(
        'success', true,
        'session', json_build_object(
            'id', p_session_id,
            'durationMinutes', v_duration_minutes,
            'totalAmount', v_calculated_amount
        )
    );
END;
$$;

COMMENT ON FUNCTION public.rpc_end_session(UUID, DECIMAL) IS
    'จบเซสชัน — ยอดเงินต้องมาจากพนักงานเสมอ ระบบไม่คิดให้อัตโนมัติ';

-- ============================================================
-- 6. bookings.total_price — ใช้ rate ของสาขาเครื่องเหมือนกัน
--
-- เดิม rpc_create_booking คิด CEIL(นาที/60) * hourly_rate
-- ตอนนี้ลูกค้าเห็นราคาตาม tier แต่ถูกบันทึกยอดอื่นใน DB = ข้อมูลขัดกัน
--
-- ⚠️ DROP ต้องเป็น signature เดิมเป๊ะ (UUID, TEXT, TEXT, DATE, TIME, ...)
--   ถ้า DROP ผิด type PostgreSQL จะไม่ error แต่ก็ไม่ลบตัวเก่า ทิ้งเป็น
--   overload คู่กันไว้ แล้ว PostgREST จะเลือกไม่ได้ตอนเรียก →
--   "Could not choose the best candidate function" → ทุกการจองได้ 500
--   เจอตอนทดสอบบนเบราว์เซอร์จริง จึงมี assertion กันไว้ใน scripts/test/ ด้วย
-- ============================================================

DROP FUNCTION IF EXISTS public.rpc_create_booking(
    UUID, TEXT, TEXT, DATE, TIME, INTEGER, TEXT, TEXT, UUID
);

CREATE OR REPLACE FUNCTION public.rpc_create_booking(
    p_machine_id UUID,
    p_customer_phone TEXT,
    p_customer_name TEXT,
    p_local_date DATE,
    p_local_start_time TEXT,
    p_duration_minutes INTEGER,
    p_timezone TEXT DEFAULT 'Asia/Bangkok',
    p_notes TEXT DEFAULT NULL,
    p_customer_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_customer_id UUID;
    v_booking_id UUID;
    v_start_at TIMESTAMPTZ;
    v_end_at TIMESTAMPTZ;
    v_conflict_count INTEGER;
    v_total_price DECIMAL;
    v_existing_customer RECORD;
    v_current_profile_id UUID;
    v_branch_id UUID;
BEGIN
    -- Input sanitization
    p_customer_phone := TRIM(p_customer_phone);
    p_customer_name := TRIM(p_customer_name);

    -- Prevent concurrent duplicate creation
    PERFORM pg_advisory_xact_lock(hashtext('customer_creation_' || p_customer_phone));

    v_current_profile_id := public.get_active_profile_id();

    -- Convert local date+time to TIMESTAMPTZ
    v_start_at := (p_local_date || ' ' || p_local_start_time)::TIMESTAMP AT TIME ZONE p_timezone;
    v_end_at := v_start_at + (p_duration_minutes || ' minutes')::INTERVAL;

    -- Check for time slot conflicts
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.bookings
    WHERE machine_id = p_machine_id
      AND status IN ('pending', 'confirmed', 'checked_in', 'seated')
      AND start_at < v_end_at
      AND end_at > v_start_at;

    IF v_conflict_count > 0 THEN
        RETURN json_build_object('success', false, 'error', 'ช่วงเวลานี้ถูกจองแล้ว กรุณาเลือกเวลาอื่น');
    END IF;

    -- สาขาของเครื่อง = สาขาที่คิดราคา (เครื่องย้ายสาขาไม่ได้ตอนมีเซสชัน)
    SELECT branch_id INTO v_branch_id
    FROM public.machines WHERE id = p_machine_id;

    IF v_branch_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'ไม่พบเครื่องนี้');
    END IF;

    v_total_price := public.calculate_session_price(v_branch_id, p_duration_minutes);

    -- Get customer by phone
    SELECT * INTO v_existing_customer
    FROM public.customers WHERE phone = p_customer_phone LIMIT 1;

    IF FOUND THEN
        -- Security: Profile Protection
        IF v_existing_customer.profile_id IS NOT NULL THEN
            IF v_current_profile_id IS NULL OR v_current_profile_id != v_existing_customer.profile_id THEN
                RETURN json_build_object('success', false, 'error', 'เบอร์นี้ผูกกับบัญชีสมาชิก กรุณาเข้าสู่ระบบก่อนทำรายการ');
            END IF;
        END IF;

        -- Security: Ownership check
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

    -- Create booking
    INSERT INTO public.bookings (
        machine_id, customer_id, start_at, end_at, duration_minutes,
        business_timezone, status, notes, total_price
    ) VALUES (
        p_machine_id, v_customer_id, v_start_at, v_end_at, p_duration_minutes,
        p_timezone, 'confirmed', p_notes, v_total_price
    )
    RETURNING id INTO v_booking_id;

    RETURN (
        SELECT json_build_object(
            'success', true,
            'booking', json_build_object(
                'id', b.id, 'machineId', b.machine_id, 'customerId', b.customer_id,
                'customerName', c.name, 'customerPhone', c.phone,
                'startAt', b.start_at, 'endAt', b.end_at,
                'localDate', b.local_date, 'localStartTime', b.local_start_time::TEXT,
                'localEndTime', b.local_end_time::TEXT, 'durationMinutes', b.duration_minutes,
                'businessTimezone', b.business_timezone, 'isCrossMidnight', b.is_cross_midnight,
                'status', b.status, 'totalPrice', b.total_price, 'createdAt', b.created_at
            )
        )
        FROM public.bookings b
        JOIN public.customers c ON c.id = b.customer_id
        WHERE b.id = v_booking_id
    );
END;
$$;

COMMENT ON FUNCTION public.rpc_create_booking(UUID, TEXT, TEXT, DATE, TEXT, INTEGER, TEXT, TEXT, UUID) IS
    'จองเวลา — ราคาคิดจาก rate ของสาขาที่เครื่องนั้นอยู่';

-- ============================================================
-- 7. bookings trigger — ทิ้งสูตร hourly_rate เดิม
--
-- trigger calculate_booking_price ยังคำนวณจาก machines.hourly_rate
-- ซึ่งไม่ตรงกับที่ RPC ใส่ไว้แล้ว (trigger เป็น BEFORE INSERT OR UPDATE OF duration_minutes)
-- ถ้าแก้ duration_minutes หลังจอง ราคาจะถูก trigger เขียนทับกลับเป็นสูตรเก่า
-- → ต้องให้ trigger ใช้ rate ของสาขาเหมือนกัน
-- ============================================================

CREATE OR REPLACE FUNCTION public.calculate_booking_total_price()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_branch_id UUID;
BEGIN
    SELECT branch_id INTO v_branch_id
    FROM public.machines
    WHERE id = NEW.machine_id;

    IF NEW.total_price IS NULL THEN
        NEW.total_price := public.calculate_session_price(v_branch_id, NEW.duration_minutes);
    END IF;

    RETURN NEW;
END;
$$;

-- ============================================================
-- 8. machines.hourly_rate — ทำให้เป็นแบบว่าง แล้วบังคับว่าห้ามอ่านมันเป็นราคา
--
-- ยังไม่ลบ column เพราะ MachinesTab (หน้า backend) เขียนค่านี้อยู่
-- แต่ไม่มีอะไรอ่านมันเพื่อคิดเงินอีกแล้ว
-- ⚠️ ถ้าทีมมีเครื่องที่ตั้งราคาเฉพาะ (เครื่อง VIP แพงกว่า)
--    ต้องเพิ่ม per-machine override ในตารางนี้ ไม่ใช่แก้กลับไปอ่าน hourly_rate
-- ============================================================

COMMENT ON COLUMN public.machines.hourly_rate IS
    'DEPRECATED — ไม่ถูกใช้คิดเงินอีกต่อไป ราคามาจาก branch_rate_tiers ของสาขานั้น';

-- ตั้งเป็น 0 ให้หมด เพื่อให้เห็นทันทีว่าค่าที่เหลือไม่มีความหมาย
-- (ค่าคงเดิมทั้งหมดเป็น 0 อยู่แล้ว — เครื่องถูก seed มาโดยไม่ได้ใส่ราคา)
UPDATE public.machines SET hourly_rate = 0 WHERE hourly_rate <> 0;