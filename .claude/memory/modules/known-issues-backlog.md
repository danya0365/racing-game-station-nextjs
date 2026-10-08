---
name: known-issues-backlog
description: dead code, dependency ที่ไม่ได้ใช้, ช่องโหว่ที่ยังไม่แก้ — อ่านเมื่อจะเลือกงานถัดไปหรือตอบว่าแก้อะไรแล้ว
metadata:
  type: module
  status: active
  scope: global
  updated: 2026-10-08
---

# Known Issues — ยังไม่ได้แก้

ค้นพบจากการอ่านโค้ดทั้งโปรเจค 2026-10-08 · **รายละเอียดเต็มที่ [README.md → Known Issues](../../../README.md#-known-issues--สิ่งที่ยังต้องแก้)**

## Dead code — grep ยืนยัน = 0 import

| ไฟล์                                                                   | ~บรรทัด |
| ---------------------------------------------------------------------- | ------- |
| `src/infrastructure/repositories/mock/MockCustomerRepository.ts`       | 200     |
| `src/infrastructure/repositories/mock/MockMachineRepository.ts`        | 150     |
| `src/presentation/presenters/auth/AuthPresenterServerFactory.ts`       | 25      |
| `src/presentation/presenters/booking/BookingPresenterServerFactory.ts` | 30      |
| `src/presentation/providers/AuthProvider.tsx` (+ hook 5 ตัว)           | 120     |
| `src/presentation/components/booking/BookingView.tsx`                  | 250     |
| `src/presentation/components/backend/QueueDetailModal.tsx`             | 200     |

**ผลรวม ~1,175 บรรทัด** — ถอด Mock ออก → `RepositoryFactory` เหลือแค่ `Api*` → ชื่อ "Factory" ที่หลอกตาเลิก

> `AuthPresenterServerFactory` / `BookingPresenterServerFactory` อาจตั้งใจ "เตรียมไว้" — ถ้าอยากเก็บ ให้ย้ายไป `docs/` แทนลบ

## Dependency ที่ไม่ถูก import ที่ไหนเลย

`axios` · `zod` · `html2canvas` · `prismjs` · `@types/prismjs` · `react-hook-form` ·
`@uidotdev/usehooks` · `clsx` · `localforage` · `react-spring`

> `zod` อาจจำเป็นถ้าจะเพิ่ม validation — ตอนนี้ยังไม่ได้ใช้ ถ้าวางแผนจะเพิ่มก็เก็บไว้

## ช่องโหว่ที่ควรแก้ก่อน

### 🔴 สูง — RPC ไม่ตรวจ ownership

`rpc_get_my_bookings(p_customer_id)` และ `rpc_get_my_walk_in_queue(p_customer_id)`
เป็น `SECURITY DEFINER` + grant ให้ `anon` + **ไม่ตรวจว่าผู้เรียกเป็นเจ้าของ**
→ เดา UUID ก็อ่านข้อมูลลูกค้า (ชื่อ + เบอร์โทรไม่ mask + ประวัติจอง) ของรายอื่นได้
`SECURITY DEFINER` ทำให้ bypass RLS → กฎ RLS ช่วยไม่ได้

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
และไฟล์นี้ไม่ถูก `config.toml` อ้างอิงอยู่แล้ว

## Component ที่ผิดทิศ (สำหรับ dep-cruiser ในเฟส 1)

ทั้ง 3 เป็น feature `booking` และ `BookingPresenter` มีอยู่แล้ว — แค่ไม่ถูกเรียก

| Component                                                     | import ผิด          |
| ------------------------------------------------------------- | ------------------- |
| `src/presentation/components/backend/BookingsTab.tsx`         | `RepositoryFactory` |
| `src/presentation/components/customer/BookingStatusView.tsx`  | `RepositoryFactory` |
| `src/presentation/components/customer/BookingHistoryView.tsx` | `RepositoryFactory` |

## อื่นๆ

- `.claude/settings.local.json` มี API key — ถูก ignore แล้ว (`/claude/settings.local.json`) แต่ระวังอย่า commit
- ไม่มี `error.tsx` / `global-error.tsx` — error ใน Server Component จะไม่มี UI สำรอง
- `useWalkInPresenter.ts` เรียก `createClientWalkInPresenter()` แต่ไม่มี `'use client'` — hook ตัวเดียวที่ขาด
- `ImageUploadInput.tsx` มี `useState`/`useRef` แต่ไม่มี `'use client'`
- `ControlView.tsx` = 1,264 บรรทัด (God component) — ใหญ่แต่ทำงานได้ **ไม่คุ้มเสี่ยงแตะ**
- `Customer.phone` ไม่มี `UNIQUE` แม้ RPC ทุกตัวใช้เป็น identity key
- `getAvailableDates()` ไม่ query DB — generate วันที่ 7 วันใน TS
- `SupabaseCustomerRepository.getStats()` select ลูกค้าทั้งหมดแล้วค่อยกรองใน JS

## กติกาอัปเดต

แก้ข้อไหนแล้ว → **ตัดออกจากทั้งไฟล์นี้และ README.md → Known Issues**
ทั้งสองที่ต้องตรงกัน ไม่งั้น memory จะหลอกว่ายังมีปัญหาที่แก้แล้ว

ดู [[0002-strangler-fig-not-full-hexagonal]] · [[project-racing-game-station]]
