-- ============================================================
-- Multi-branch regression checks
-- Run against a DB that has migration 20261008000000_multi_branch.sql applied
--   psql "$DATABASE_URL" -f scripts/sql/test-multi-branch.sql
--
-- Every check should show the branch split. p_branch_id NULL = ทั้งหมด.
-- ============================================================

\echo '--- 1. สาขา seeded ---'
SELECT slug, name FROM public.branches ORDER BY position;

\echo '--- 2. ทุก machine ต้องมีสาขา (NOT NULL enforced) ---'
SELECT count(*) AS total, count(branch_id) AS with_branch FROM public.machines;

\echo '--- 3. ทุก walk_in_queue ต้องมีสาขา ---'
SELECT count(*) AS total, count(branch_id) AS with_branch FROM public.walk_in_queue;

\echo '--- 4. get_active_machines แยกตามสาขา ---'
SELECT 'all' AS scope, count(*) FROM public.rpc_get_active_machines(NULL)
UNION ALL
SELECT 'pattani', count(*) FROM public.rpc_get_active_machines('00000000-0000-0000-0000-000000000b01')
UNION ALL
SELECT 'narathiwas', count(*) FROM public.rpc_get_active_machines('00000000-0000-0000-0000-000000000b02');

\echo '--- 5. backend_stats แยกตามสาขา ---'
SELECT 'all' AS scope, (public.rpc_get_backend_stats(NULL)->'machines'->>'total') AS machines
UNION ALL
SELECT 'pattani', (public.rpc_get_backend_stats('00000000-0000-0000-0000-000000000b01')->'machines'->>'total')
UNION ALL
SELECT 'narathiwas', (public.rpc_get_backend_stats('00000000-0000-0000-0000-000000000b02')->'machines'->>'total');

\echo '--- 6. home_dashboard_stats แยกตามสาขา ---'
SELECT 'all' AS scope, (public.rpc_get_home_dashboard_stats(CURRENT_DATE, NULL))::text
UNION ALL
SELECT 'pattani', (public.rpc_get_home_dashboard_stats(CURRENT_DATE, '00000000-0000-0000-0000-000000000b01'))::text
UNION ALL
SELECT 'narathiwas', (public.rpc_get_home_dashboard_stats(CURRENT_DATE, '00000000-0000-0000-0000-000000000b02'))::text;

\echo '--- 7. active_sessions แยกตามสาขา (ผูกผ่าน machine) ---'
SELECT 'all' AS scope, count(*) FROM public.rpc_get_active_sessions(NULL)
UNION ALL
SELECT 'pattani', count(*) FROM public.rpc_get_active_sessions('00000000-0000-0000-0000-000000000b01')
UNION ALL
SELECT 'narathiwas', count(*) FROM public.rpc_get_active_sessions('00000000-0000-0000-0000-000000000b02');

\echo '--- 8. walk_in_queue_stats แยกตามสาขา ---'
SELECT 'all' AS scope, (public.rpc_get_walk_in_queue_stats(NULL)->>'waitingCount') AS waiting
UNION ALL
SELECT 'pattani', (public.rpc_get_walk_in_queue_stats('00000000-0000-0000-0000-000000000b01')->>'waitingCount')
UNION ALL
SELECT 'narathiwas', (public.rpc_get_walk_in_queue_stats('00000000-0000-0000-0000-000000000b02')->>'waitingCount');

\echo '--- 9. session_stats แยกตามสาขา ---'
SELECT 'all' AS scope, (public.rpc_get_session_stats(CURRENT_DATE, CURRENT_DATE, NULL)->>'totalSessions') AS sessions
UNION ALL
SELECT 'narathiwas', (public.rpc_get_session_stats(CURRENT_DATE, CURRENT_DATE, '00000000-0000-0000-0000-000000000b02')->>'totalSessions');

\echo '--- 10. join_walk_in_queue derive สาขาจากเครื่องที่เลือก ---'
\echo '    (เรียกเองแล้วตรวจว่า queue.branch_id == machine.branch_id)'
SELECT wq.queue_number, wq.branch_id AS queue_branch, m.branch_id AS machine_branch,
       (wq.branch_id = m.branch_id) AS matches
FROM public.walk_in_queue wq
LEFT JOIN public.machines m ON m.id = wq.preferred_machine_id
WHERE wq.preferred_machine_id IS NOT NULL
ORDER BY wq.joined_at DESC
LIMIT 5;