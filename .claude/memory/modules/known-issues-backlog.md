---
name: known-issues-backlog
description: "dead code, dependency ที่ไม่ได้ใช้, ช่องโหว่ที่ยังไม่แก้ — อ่านเมื่อจะเลือกงานถัดไปหรือตอบว่าแก้อะไรแล้ว"
metadata:
  node_type: memory
  type: module
  status: active
  scope: global
  updated: 2026-10-11
  originSessionId: 60c34a9c-354d-40d9-be16-01e33bef7714
  modified: 2026-10-11T12:07:08.175Z
---

# Known Issues — ยังไม่ได้แก้

ค้นพบจากการอ่านโค้ดทั้งโปรเจค 2026-10-11 · **รายละเอียดเต็มที่ [README.md → Known Issues](../../../README.md#-known-issues--สิ่งที่ยังต้องแก้)**

## Dead code — grep ยืนยัน = 0 import

| ไฟล์                                                                   | บรรทัด |
| ---------------------------------------------------------------------- | ----- |
| `src/infrastructure/repositories/mock/MockCustomerRepository.ts`       | 260    |
| `src/infrastructure/repositories/mock/MockMachineRepository.ts`        | 239    |
| `src/presentation/presenters/auth/AuthPresenterServerFactory.ts`       | 22     |
| `src/presentation/presenters/booking/BookingPresenterServerFactory.ts` | 27     |
| `src/presentation/providers/AuthProvider.tsx` (+ hook 5 ตัว)           | 95     |

**ผลรวม ~643 บรรทัด** — ถอด Mock ออก → `RepositoryFactory` เหลือแค่ `Api*` → ชื่อ "Factory" ที่หลอกตาเลิก

> `AuthPresenterServerFactory` / `BookingPresenterServerFactory` อาจตั้งใจ "เตรียมไว้" — ถ้าอยากเก็บ ให้ย้ายไป `docs/` แทนลบ

> ✅ ลบแล้วใน `55d4c0b` — `BookingView.tsx` · `QueueDetailModal.tsx` · `TimezoneNoticeCompact/Floating`
> (ตัวเลข ~1,175 เดิมนับไฟล์พวกนี้ไว้ — ตัดออกแล้ว)

## Dependency ที่ไม่ถูก import ที่ไหนเลย

`axios` · `zod` · `html2canvas` · `prismjs` · `@types/prismjs` · `react-hook-form` ·
`@uidotdev/usehooks` · `clsx` · `localforage` · `react-spring`

> `zod` อาจจำเป็นถ้าจะเพิ่ม validation — ตอนนี้ยังไม่ได้ใช้ ถ้าวางแผนจะเพิ่มก็เก็บไว้

## ช่องโหว่ที่ควรแก้ก่อน

### 🔴 สูงสุด — RPC ไม่ตรวจ ownership

`rpc_get_my_bookings(p_customer_id)` และ `rpc_get_my_walk_in_queue(p_customer_id)`
เป็น `SECURITY DEFINER` + grant ให้ `anon` + **ไม่ตรวจว่าผู้เรียกเป็นเจ้าของ**
→ เดา UUID ก็อ่านข้อมูลลูกค้า (ชื่อ + เบอร์โทรไม่ mask + ประวัติจอง) ของรายอื่นได้
`SECURITY DEFINER` ทำให้ bypass RLS → กฎ RLS ช่วยไม่ได้

ยืนยันแล้วว่าเป็นแบบนี้ใน**ทั้งสอง migration** — `20260108131501_racing_system_rpc.sql` และ
`20261008000000_multi_branch.sql` ที่ override ทับ (ตรวจ 2026-10-11)
ชื่อฟังก์ชันขึ้นต้นด้วย `my_` แต่ไม่ได้ทำอะไร — grant ให้ `anon` คือทางเข้าเดียวที่ต้องผ่าน

### 🟡 ต่ำ — payment allowlist ไม่ตรง enum

`app/api/sessions/[id]/payment/route.ts` ยอมรับ `['unpaid','paid','refunded']`
แต่ enum `payment_status` มีแค่ `unpaid|paid|partial` → ส่ง `refunded` แล้ว DB รับไม่ได้

### 🟡 ต่ำ — error ของ Postgres หลุดถึง client

หลาย route return `error.message` ของ Supabase ดิบๆ
(`app/api/sessions/route.ts` · `app/api/walk-in-queue/route.ts` · `app/api/dashboard/stats` · `app/api/storage/upload`)

### 🟡 ต่ำ — `storage.sign_url()` ไม่มีจริง

`get_private_url()` ใน migration `20250618000003_storage.sql` เรียก `storage.sign_url(...)`
ที่ถูกคือ `storage.create_signed_url(...)` → function นี้ยังไม่ถูกเรียกที่ไหน

## Seed มีปัญหา

**seed ไม่ grant admin:** profiles ทั้งหมดถูก insert ด้วย `is_active = FALSE`
แต่โค้ด grant role ใช้ `WHERE p.is_active = true` → **ไม่มีโปรไฟล์ไหนได้ role admin จริง**
(`admin@racing.com` ต้อง login แล้วเรียก `set_profile_active` ก่อนถึงจะเข้า `/backend` ได้)

**`supabase/seeds_mock/000-init_seed.sql` รันไม่ได้** — อ้างตาราง `public.queues` และ
type `public.queue_status` ที่ไม่มีอยู่จริง (schema ปัจจุบันใช้ `walk_in_queue` + `walk_in_status`)
`config.toml` ชี้ `sql_paths = ["./seeds/*.sql"]` เท่านั้น → ไฟล์นี้ไม่ทำให้ `db reset` พัง แต่ก็ไม่มีใครรัน

## Component ที่ผิดทิศ (สำหรับ dep-cruiser ในเฟส 1)

ทั้ง 3 เป็น feature `booking` และ `BookingPresenter` มีอยู่แล้ว — แค่ไม่ถูกเรียก

| Component                                                     | import ผิด          |
| ------------------------------------------------------------- | ------------------- |
| `src/presentation/components/backend/BookingsTab.tsx`         | `RepositoryFactory` |
| `src/presentation/components/customer/BookingStatusView.tsx`  | `RepositoryFactory` |
| `src/presentation/components/customer/BookingHistoryView.tsx` | `RepositoryFactory` |

ยืนยันแล้วว่ายังอยู่ครบทั้ง 3 ตัว (2026-10-11) · ยังไม่มี `dep-cruiser` ใน gate

## อื่นๆ

- `.claude/settings.local.json` มี API key — ถูก ignore แล้ว (`/claude/settings.local.json`) แต่ระวังอย่า commit
- ไม่มี `error.tsx` / `global-error.tsx` — error ใน Server Component จะไม่มี UI สำรอง ร้านเห็นจอขาว
- `ImageUploadInput.tsx` มี `useState`/`useRef` แต่ไม่มี `'use client'` — ยังทำงานได้เพราะผู้เรียก (`MachinesTab`) เป็น client อยู่แล้ว
- `middleware.ts` ใช้ convention เดิม — Next.js 16 build เตือนทุกครั้ง ให้เปลี่ยนเป็น `proxy.ts`
- `ControlView.tsx` = 1,527 บรรทัด (God component) — ใหญ่แต่ทำงานได้ **ไม่คุ้มเสี่ยงแตะ**
- `Customer.phone` ไม่มี `UNIQUE` แม้ RPC ทุกตัวใช้เป็น identity key
- `getAvailableDates()` ไม่ query DB — generate วันที่ 7 วันใน TS (`SupabaseBookingRepository.ts`)
- `SupabaseCustomerRepository.getStats()` select ลูกค้าทั้งหมดแล้วค่อยกรองใน JS
- `/api/sessions/[id]/payment` ยอมรับ `refunded` ที่ไม่มีใน enum `payment_status`
- **กับดัก multi-branch — `rpc_join_walk_in_queue` เดาสาขาเอง** · `20261008000000_multi_branch.sql` บรรทัด `COALESCE(p_branch_id, '00000000-0000-0000-0000-000000000b02')` ฝัง UUID นราธิวาสไว้เป็น fallback · เข้าคิวไม่เลือกเครื่อง + ไม่ส่ง branch → ลงคิวนราธิวาสโดยไม่ถาม · ตอนนี้ยังถูก (นราธิวาสสาขาเดียวที่มีเครื่อง) พัตก็ตอนแตกสาขาที่ 3 · แก้โดยคืน `success: false` + error "ไม่ทราบสาขา" วัด 2026-10-11
- **ตาราง `branches` ไม่มี GRANT** — migration เดิม `GRANT ALL` ให้ 5 ตารางหลักแต่ `branches` ไม่มีบรรทัด GRANT · ยังไม่พังเพราะอ่านผ่าน `rpc_get_branches()` (SECURITY DEFINER) แต่ `.from('branches')` ตรงจะ permission denied วัด 2026-10-11
- **ยังไม่มี CI** — gate ทุกตัวรันมือ (วัด 2026-10-12)
- **unit test ครอบแค่ฝั่งราคา** (`scripts/test/`, 26 เคส) — presenter/repository/session billing ยังไม่มี (เพิ่ม 2026-10-12)
- **`npm run lint` แดง 103 errors / 23 warnings** — ของเก่าทั้งหมด วัด 2026-10-12 เทียบ HEAD แล้วไม่มีของใหม่

## ข้อที่ตรวจแล้ว "ไม่มีปัญหา" (อย่าไปหาซ้ำ)

- **`SupabaseChatRepository` เรียก RPC ไม่ส่ง branch** 6 จุด → `p_branch_id NULL` = ทั้งหมด · **ยังไม่มีผล** เพราะ chat ยังปิดอยู่ (`NEXT_PUBLIC_ENABLE_CHAT_WIDGET=false`) และปัตตานียังไม่มีเครื่อง — เปิด chat ก่อนต้องแก้ วัด 2026-10-11
- **`machines.branch_id` NOT NULL ไม่มี default** → ปลอดภัยตอนนี้ เพราะ insert มีทางเดียว (`SupabaseMachineRepository.create`) และฟอร์ม `MachinesTab` default ไว้แล้ว แต่ผูกกันแน่น ถ้ามี client เก่า insert ไม่ผ่าน วัด 2026-10-11
- **`branches.id` เป็น UUID ไม่ใช่ภาษาไทย** — ถูกกฎโปรเจคแล้ว: identifier เป็น latin เสมอ ภาษาไทยแปลงตอนแสดงผลเท่านั้น (`slug` = `narathiwas`/`pattani` ใน URL · `name` = ไทยใน `branch.config.ts`)

## กติกาอัปเดต

แก้ข้อไหนแล้ว → **ตัดออกจากทั้งไฟล์นี้และ README.md → Known Issues**
ทั้งสองที่ต้องตรงกัน ไม่งั้น memory จะหลอกว่ายังมีปัญหาที่แก้แล้ว

ดู [[0002-strangler-fig-not-full-hexagonal]] · [[project-racing-game-station]]
