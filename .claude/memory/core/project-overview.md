---
name: project-racing-game-station
description: บริบทโปรเจค Racing Game Station + เอกสารอยู่ไหน + ห้ามสร้างเอกสารซ้ำ — อ่านเมื่อจะแก้เอกสารหรือตอบคำถามเรื่องระบบ
metadata:
  type: reference
  status: active
  scope: global
  updated: 2026-10-08
---

# Racing Game Station — บริบทโปรเจค

## ระบบนี้คืออะไร

ระบบ**จองเวลา + คิว walk-in** สำหรับร้านเกมแข่งรถ พร้อม billing ตามเวลาที่เล่นจริง

- Production: <https://racing-game-station.vercel.app/> — **ขึ้น prod แล้วหลายเดือน มีผู้ใช้จริง**
- ผู้ใช้กลุ่มเป้าหมาย: ลูกค้าหน้าร้าน (walk-in) และลูกค้าจองล่วงหน้า
- พนักงานใช้ `/backend` เพื่อควบคุมเครื่อง/คิว/เซสชัน

## Stack

| หมวด      | เทคโนโลยี                                                  |
| --------- | ---------------------------------------------------------- |
| Framework | Next.js 16.1 (App Router, Turbopack)                       |
| UI        | React 19.2                                                 |
| Language  | TypeScript 5 (`strict: true`)                              |
| Styling   | TailwindCSS v4 (`@theme` tokens + CSS custom properties)   |
| State     | Zustand 5 (+ `persist`)                                    |
| Database  | Supabase PostgreSQL — 7 ตาราง, 10 migrations, 39 functions |
| Auth      | Supabase Auth (Email/Password, +OTP/OAuth เตรียมไว้แต่ปิด) |
| Chat      | LINE Messaging API + Web Chat Widget                       |

## โครงสร้าง

```
app/        routing เท่านั้น (page/layout/loading) + api/ (28 route handler)
src/
  application/    repository interface (9) + ChatService
  domain/types/    domain entities + generated supabase types
  infrastructure/  repository impl (api/ 7, mock/ 2, supabase/ 9) + supabase client
  presentation/    components (50) + presenters (32) + stores (5) + providers + config
supabase/          migrations/ + seeds/
scripts/           deploy scripts + git hooks + test-api.ts
```

**ทิศปัจจุบัน:** `presentation → application (interface) → infrastructure (impl)`
presenter class ไม่ import infrastructure เลย 0 จุด · factory ที่ import คือ composition root (ถูกต้อง)

## เอกสารอยู่ไหน — อ่านก่อนตอบ

| ไฟล์                                              | เนื้อหา                                                                                                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [README.md](../../../README.md)                   | **แหล่งหลัก** — เขียนใหม่ทั้งฉบับ 2026-10-08 ให้ตรงกับโค้ดจริงทุกจุด: route ทั้งหมด, RPC ทั้งหมด, presenter pattern, pricing, Known Issues 20 รายการ |
| [docs/DEPLOYMENT.md](../../../docs/DEPLOYMENT.md) | deploy ไป Vercel + Supabase ทีละขั้น                                                                                                                   |
| `docs/audit/`                                     | ⚠️ **ล้าสมัย** (ม.ค. 2026) — มีคำเตือนกำกับไว้แล้ว ให้ดู README → Known Issues แทน                                                                     |
| `prompt/CREATE_PAGE_PATTERN.md`                   | เทมเพลตสร้างหน้าใหม่ตาม Clean Architecture                                                                                                             |
| `prompt/CREATE_REPO_PATTERN.md`                   | เทมเพลตสร้าง Repository ใหม่                                                                                                                           |

### กฎสำคัญเรื่องเอกสาร

**ห้ามสร้างไฟล์เอกสารใหม่ซ้ำกับที่มี** — อัปเดตไฟล์เดิมเสมอ
อ่าน README ก่อนตอบคำถามเรื่องระบบ ไม่ต้องไล่อ่านโค้ดซ้ำ ยกเว้นต้องการรายละเอียดที่ README ไม่ครอบคลุม

## ภาษา

ผู้ใช้สื่อสารเป็น**ภาษาไทย** — ตอบไทย · เอกสารเขียนไทย · โค้ด comment อังกฤษ

## ข้อควรรู้

- ราคา/กติกาทางธุรกิจทั้งหมดอยู่ที่ `src/config/booking.config.ts` — แก้ที่เดียว ทั้งระบบเปลี่ยน
- `OPERATING_HOURS` มี `isOpen24Hours: true` ซึ่ง override `open: 10` / `close: 22` → ระบบเปิดตลอด 24 ชม.
- `TIMEZONE_CONFIG.defaultBusinessTimezone = 'Asia/Bangkok'` — ทุก query วันที่อิงเวลาร้าน
- โปรเจค **ไม่ได้ใช้ `SUPABASE_SERVICE_ROLE_KEY` ในโค้ดเลย** — ทุกอย่างรันด้วย anon key + RLS + RPC guards
- `sessions` คือแหล่งความจริงของรายได้ (ไม่ใช่ `bookings`) — คิดเงินตอนจบเซสชัน
- `app/api/system/` ว่างเปล่า — ไม่ต้องนับเป็น route

ดู [[0002-strangler-fig-not-full-hexagonal]] · [[0003-git-branch-only]] · [[known-issues-backlog]]
