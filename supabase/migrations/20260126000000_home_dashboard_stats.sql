-- ============================================================
-- RPC: Get Home Dashboard Stats
-- Created: 2026-01-26
-- Description: Aggregate stats for Home Page Dashboard
-- ============================================================

CREATE OR REPLACE FUNCTION public.rpc_get_home_dashboard_stats(
    p_date DATE DEFAULT CURRENT_DATE
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
    -- 1. Bookings Today (Count all bookings for this local_date)
    SELECT COUNT(*) INTO v_today_bookings
    FROM public.bookings
    WHERE local_date = p_date;

    -- 2. Walk-in Queue (Count all walk-in entries created today)
    -- Using joined_at converted to Bangkok Time
    SELECT COUNT(*) INTO v_walk_in_queue_count
    FROM public.walk_in_queue
    WHERE (joined_at AT TIME ZONE 'Asia/Bangkok')::DATE = p_date;

    -- 3. General Customers (Sessions today without booking_id and queue_id)
    -- These are pure walk-ins/manual sessions not from queue or booking
    SELECT COUNT(*) INTO v_general_customers
    FROM public.sessions
    WHERE (start_time AT TIME ZONE 'Asia/Bangkok')::DATE = p_date
      AND booking_id IS NULL 
      AND queue_id IS NULL;

    -- 4. Total Players Today (All sessions today)
    SELECT COUNT(*) INTO v_total_players
    FROM public.sessions
    WHERE (start_time AT TIME ZONE 'Asia/Bangkok')::DATE = p_date;

    RETURN json_build_object(
        'todayBookings', COALESCE(v_today_bookings, 0),
        'walkInQueue', COALESCE(v_walk_in_queue_count, 0),
        'generalCustomers', COALESCE(v_general_customers, 0),
        'totalPlayers', COALESCE(v_total_players, 0)
    );
END;
$$;

-- Grant access to public (anon) and authenticated users
GRANT EXECUTE ON FUNCTION public.rpc_get_home_dashboard_stats(DATE) TO anon, authenticated;
