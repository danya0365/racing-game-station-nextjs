# 🗄️ Database Security & Integrity Audit

This section documents the security analysis of the Supabase PostgreSQL database, focusing on Row Level Security (RLS), Stored Procedures (RPCs), and Data Integrity constraints.

> ## ⚠️ หมายเหตุเรื่องชื่อไฟล์ migration
>
> รายงานทั้ง 3 ฉบับในโฟลเดอร์นี้อ้างถึงไฟล์ migration ที่ **ไม่มีอยู่จริง**:
>
> `20260115000000_bookings.sql` · `20260119000001_walk_in_queue.sql` · `20260119000002_sessions.sql` · `20260119000003_bookings_evolution.sql`
>
> ตารางเหล่านี้ถูกสร้างจริงใน:
>
> | ไฟล์จริง | เนื้อหา |
> |----------|--------|
> | [`20260108131500_racing_system.sql`](../../../supabase/migrations/20260108131500_racing_system.sql) | ตาราง `machines` / `customers` / `bookings` / `walk_in_queue` / `sessions` + enum 4 ตัว + RLS + index + trigger `calculate_booking_total_price` |
> | [`20260108131501_racing_system_rpc.sql`](../../../supabase/migrations/20260108131501_racing_system_rpc.sql) | RPC 27 ตัว + grants |
>
> **เนื้อหาในรายงานยังใช้อ้างอิงได้** (เป็น schema ชุดเดียวกัน) — แต่ต้องแก้ชื่อไฟล์ก่อน
>
> ดูภาพรวมปัจจุบันที่ [README.md → Database](../../../README.md#-database) และรายการช่องโหว่ที่ [docs/audit/README.md](../README.md#-ช่องโหว่ที่ยังไม่ได้แก้-จากการอ่านโค้ดล่าสุด)

## 📋 Table of Contents

- [**Walk-in Queue System**](./walk_in_structure.md) - Analysis of `walk_in_queue` table and related RPCs.
- [**Session Management**](./sessions_structure.md) - Analysis of `sessions` table (Time tracking & Billing).
- [**Bookings v2**](./bookings_structure.md) - Analysis of the enhanced `bookings` table (Total Price & Check-in).

## 🛡️ General Security Policies

### RLS Strategy
- **Public Tables**: All 7 tables in `public` have RLS enabled.
- **Admin Access**: Uses `is_moderator_or_admin()` function to centralize role checks.
- **Guest Access**: Strictly limited via `rpc_` functions with `SECURITY DEFINER` to bypass RLS in controlled scopes only.

### RPC Strategy
- **SECURITY DEFINER**: Used for public-facing actions (e.g., Joining Queue) to allow unauthenticated users to perform specific writes without granting table-level `INSERT` permissions.
- **Input Validation**: Most RPCs validate inputs (machine state, queue state, ownership) before mutation.

> 🔴 **ข้อยกเว้นที่พบภายหลัง**: `rpc_get_my_bookings` และ `rpc_get_my_walk_in_queue` เป็น `SECURITY DEFINER` + grant ให้ `anon` แต่ **ไม่ตรวจ ownership** → เดา `customer_id` เพื่ออ่านข้อมูลลูกค้าคนอื่นได้ ดูรายละเอียดใน [audit README](../README.md#-ช่องโหว่ที่ยังไม่ได้แก้-จากการอ่านโค้ดล่าสุด)

---
*Last Updated: 2026-08-08 (เพิ่มหมายเหตุชื่อไฟล์ migration ที่ไม่ถูกต้อง)*

*Original: 2026-01-24*
