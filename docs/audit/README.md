# 🛡️ รายงานการตรวจสอบความปลอดภัยและเตรียมความพร้อม (Production Audit)

เอกสารฉบับนี้เป็นศูนย์กลางการเก็บข้อมูลการตรวจสอบระบบทั้งหมดก่อนที่จะนำขึ้นใช้งานจริงบน Production

> ## ⚠️ เอกสารชุดนี้ล้าสมัยแล้ว
>
> รายงานทั้งหมดในโฟลเดอร์นี้เขียนไว้ **24–25 มกราคม 2026** ก่อนที่โค้ดจะเปลี่ยนไปมาก
>
> **อย่าใช้เป็นแหล่งอ้างอิงปัจจุบัน** — ใช้ [README.md → Known Issues](../../README.md#-known-issues--สิ่งที่ยังต้องแก้) แทน ซึ่งอัปเดตจากการอ่านโค้ดล่าสุด
>
> ### สิ่งที่เปลี่ยนไปหลังจากรายงานฉบับนี้
>
> | หัวข้อ | สถานะปัจจุบัน |
> |--------|--------------|
> | ตาราง `queues` | **ไม่มีแล้ว** — ใช้ `walk_in_queue` + `sessions` แทน |
> | RPC ชุดเก่า (`rpc_get_today_queues`, `rpc_create_booking` แบบเดิม) | ถูก**รวมและเขียนใหม่ทั้งหมด** ใน `20260108131500_racing_system.sql` + `20260108131501_racing_system_rpc.sql` |
> | Client-side Supabase | เปลี่ยนเป็น **Api\*Repository** ผ่าน `/api/*` ทั้งหมด (แก้ปัญหา connection pool) |
> | ไฟล์ migration ที่รายงานอ้างถึง | ชื่อไม่ตรงกับที่มีอยู่จริง — ดูหมายเหตุล่าง |
> | ระบบ LINE OA Chat | **เพิ่มใหม่** หลังจากรายงานฉบับนี้ (มีช่องโหว่ที่ยังไม่ได้ตรวจ) |
> | `zod` | ยังไม่ได้ต่อเข้าโค้ดเลย — ไม่มี validation layer ตามที่วางแผนไว้ |
>
> ### ชื่อไฟล์ migration ที่ไม่ตรงกับของจริง
>
> รายงานใน [`database/`](./database/) อ้างถึงไฟล์เหล่านี้ — **ไม่มีอยู่ใน `supabase/migrations/`**:
>
> - `20260115000000_bookings.sql`
> - `20260119000001_walk_in_queue.sql`
> - `20260119000002_sessions.sql`
> - `20260119000003_bookings_evolution.sql`
>
> ไฟล์จริงที่สร้างตารางเหล่านี้คือ **`20260108131500_racing_system.sql`** (ตาราง + RLS + enum) และ **`20260108131501_racing_system_rpc.sql`** (RPC + grants)
>
> ส่วนเนื้อหาในรายงาน (คอลัมน์, constraint, RLS) **ยังใช้อ้างอิงได้** เพราะเป็น schema ชุดเดียวกัน — แต่ชื่อไฟล์ต้องแก้ก่อน

## 📁 โครงสร้างเอกสาร Audit

- [**การตรวจสอบส่วนหน้า (Pages Audit)**](./pages/) — วิเคราะห์การเรียกข้อมูล API/DB ในแต่ละหน้า
    - [หน้าแรก (Home Page - app/page.tsx)](./pages/home-page.md) ✅
    - [หน้าจองเวลา (Time Booking - app/time-booking/page.tsx)](./pages/time-booking.md) ✅
    - [หน้าสถานะการจอง (Booking Status - app/customer/booking-status/page.tsx)](./pages/booking-status.md) ✅
    - [หน้าตารางการจองรวม (Booking History - app/customer/booking-history/page.tsx)](./pages/booking-history.md) ✅
    - [หน้าโปรไฟล์ (Profile - app/profile/page.tsx)](./pages/profile.md) ⚠️ พบช่องโหว่
    - [หน้าแดชบอร์ดแอดมิน (Backend Dashboard - app/backend/page.tsx)](./pages/backend-dashboard.md) ✅
    - [รายละเอียดเมนูแอดมิน (Backend Tabs - รายละเอียดเจาะลึก)](./pages/backend-dashboard-tabs.md) ✅
    - [หน้าห้องควบคุมเกม (Control - app/backend/control/page.tsx)](./pages/backend-control-view.md) ✅
    - [หน้าจองคิว Walk-in (Walk-in Queue Audit)](./pages/walk-in-queue.md) ⚠️ ต้องปรับปรุง UI
- [**การตรวจสอบฐานข้อมูล (Database Audit)**](./database/) — วิเคราะห์ RLS, RPCs และ Schema
    - [Walk-in Queue System](./database/walk_in_structure.md)
    - [Session Management & Billing](./database/sessions_structure.md)
    - [Bookings v2](./database/bookings_structure.md)

> 📌 หน้าเว็บที่เพิ่มหลังรายงานฉบับนี้ และยังไม่เคยผ่าน audit: `/walk-in`, `/qr-scan`, `/privacy`, `/terms`, `/docs/*`, `/qa-checklist`, `/backend/control` (ฉบับปัจจุบัน), LINE OA Chat

## 🛠️ วิธีการตรวจสอบ (Methodology)

1. **Static Code Analysis**: ตรวจสอบการเขียน Repository ว่ามีการยิง DB ตรงๆ หรือใช้ RPC ที่ปลอดภัย
2. **Access Control Verification**: ทดสอบ RLS Policy ทั้งในสถานะคนทั่วไป (Anonymous) และ Admin
3. **Data Leakage Check**: มั่นใจว่าข้อมูลส่วนบุคคล (เบอร์โทร, ไอดี, อีเมล) จะไม่หลุดออกไปสู่สาธารณะ
4. **Logic Integrity**: ตรวจสอบว่าการกระทำสำคัญ (จอง/ยกเลิก) มีการเช็คสิทธิ์อย่างถูกต้อง

## 🔴 ช่องโหว่ที่ยังไม่ได้แก้ (จากการอ่านโค้ดล่าสุด)

รายการนี้ **ยังไม่มีในรายงานเดิม** — เพิ่มเข้ามาเพื่อไม่ให้เอกสารตามหลัง

| # | ปัญหา | จุดกระทบ | ระดับ |
|---|--------|----------|-------|
| 1 | `rpc_get_my_bookings` / `rpc_get_my_walk_in_queue` เป็น `SECURITY DEFINER` + grant ให้ `anon` + **ไม่ตรวจ ownership** | ใครก็ได้ที่รู้ `customer_id` อ่านข้อมูลลูกค้ารายอื่นได้ | 🔴 สูง |
| 2 | `rpc_get_active_sessions` grant ให้ `anon` ไม่มี filter | เปิดเผยชื่อลูกค้า/เครื่อง/ยอดเงินของ session ที่ยังเล่นอยู่ | 🟠 กลาง |
| 3 | `rpc_get_waiting_queue` grant ให้ `anon` (ปิดเบอร์โทรแล้ว แต่ชื่อ/party size/wait time เปิด) | ข้อมูลคิวหน้าร้านสาธารณะ | 🟡 ต่ำ |
| 4 | `/api/*` ไม่ถูก middleware ป้องกัน | ยิงทุก endpoint ได้ — พึ่ง RLS/RPC เป็นด่านเดียว | 🟠 กลาง |
| 5 | `/api/storage/upload` รับ `bucket` จาก request ไม่มี allowlist, ไม่ตรวจ MIME/ขนาด | เขียนไฟล์แปลกปลอมลง bucket ที่ระบุ | 🟠 กลาง |
| 6 | `Session.rejected` — payment status allowlist ใน route ยอมรับ `'refunded'` แต่ enum `payment_status` **ไม่มีค่านี้** | ส่งค่าที่ DB รับไม่ได้ → 500 | 🟡 ต่ำ |
| 7 | Error บาง route ส่ง `error.message` ของ Postgres กลับถึง client ดิบๆ | leak โครงสร้างตาราง/ชื่อ constraint | 🟡 ต่ำ |
| 8 | `customers.phone` ไม่มี `UNIQUE` แม้ RPC ใช้เป็น identity key | ลูกค้าซ้ำ / ยกเลิกข้ามเจ้าของได้ | 🟠 กลาง |
| 9 | `SupabaseCustomerRepository.getStats()` select ลูกค้าทั้งหมด | โหลดหนักเมื่อข้อมูลโต | 🟡 ต่ำ |
| 10 | `getAll(search)` ต่อ string เข้า `.or()` ของ PostgREST โดยไม่ escape | PostgREST filter injection | 🟠 กลาง |
| 11 | `storage.sign_url()` ใน `get_private_url()` ไม่มีอยู่จริง | error ตอนเรียก | 🟡 ต่ำ |
| 12 | LINE webhook verify ด้วย `===` ไม่ใช่ `crypto.timingSafeEqual` | timing attack (เป็นไปได้น้อย) | 🟡 ต่ำ |

แผนแก้ทั้งหมดอยู่ที่ [README.md → Known Issues](../../README.md#-known-issues--สิ่งที่ยังต้องแก้)

---
*อัปเดตล่าสุด: 8 ตุลาคม 2026 (เพิ่มคำเตือนเรื่องเอกสารล้าสมัย + ช่องโหว่ที่เพิ่งพบ)*

*รายงานเดิมเขียนเมื่อ 24–25 มกราคม 2026*
