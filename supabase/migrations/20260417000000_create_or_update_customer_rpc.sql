-- ============================================================
-- Racing Game Station System - RPC for Flexible Customer Registration
-- Created: 2026-04-17
-- Description: Allows hijacking/updating anonymous customer records while protecting member accounts
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_or_update_customer(
    p_name TEXT,
    p_phone TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_customer_id UUID;
    v_existing_customer RECORD;
    v_current_profile_id UUID;
BEGIN
    -- Input sanitization
    p_phone := TRIM(p_phone);
    p_name := TRIM(p_name);
    
    IF p_phone = '' OR p_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'กรุณาระบุชื่อและเบอร์โทรศัพท์');
    END IF;

    -- Prevent concurrent duplicate creation/update
    PERFORM pg_advisory_xact_lock(hashtext('customer_creation_' || p_phone));

    -- Get current user's profile ID
    v_current_profile_id := public.get_active_profile_id();

    -- Get customer by phone
    SELECT * INTO v_existing_customer
    FROM public.customers WHERE phone = p_phone LIMIT 1;

    IF FOUND THEN
        -- Security: Profile Protection
        -- หากมีการผูก profile_id ไปแล้ว จะไม่อนุญาตให้แก้ไข (Hijack) 
        -- ยกเว้นกรณีที่เป็นเจ้าของบัญชีนั้นเองที่กำลังเรียกใช้งาน
        IF v_existing_customer.profile_id IS NOT NULL THEN
            IF v_current_profile_id IS NULL OR v_current_profile_id != v_existing_customer.profile_id THEN
                RETURN json_build_object('success', false, 'error', 'เบอร์โทรศัพท์นี้ถูกลงทะเบียนเป็นสมาชิกแล้ว ไม่สามารถแก้ไขได้');
            END IF;
        END IF;

        -- ดำเนินการอัปเดตชื่อ และผูก profile_id ของคนเรียกปัจจุบัน (ถ้ามี)
        -- ในกรณีที่ profile_id เดิมเป็น NULL เราจะถือว่าเป็นการ "แฮก" หรือเคลมเบอร์นั้นมาเป็นของเรา
        UPDATE public.customers 
        SET 
            name = p_name, 
            profile_id = COALESCE(v_current_profile_id, v_existing_customer.profile_id),
            updated_at = NOW() 
        WHERE id = v_existing_customer.id
        RETURNING id INTO v_customer_id;
    ELSE
        -- ไม่พบข้อมูลเดิม ทำการสร้างใหม่
        INSERT INTO public.customers (name, phone, profile_id)
        VALUES (p_name, p_phone, v_current_profile_id)
        RETURNING id INTO v_customer_id;
    END IF;

    RETURN json_build_object(
        'success', true, 
        'customer_id', v_customer_id,
        'message', 'ดำเนินการเรียบร้อยแล้ว'
    );
END;
$$;

-- Grants
GRANT EXECUTE ON FUNCTION public.create_or_update_customer(TEXT, TEXT) TO anon, authenticated;
