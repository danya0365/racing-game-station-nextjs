<p align="center">
  <img src="public/racing-game-station-hero.svg" alt="Racing Game Station Logo" width="120" height="120" />
</p>

<h1 align="center">🏎️ Racing Game Station</h1>

<p align="center">
  <strong>ระบบจองเวลาและคิวสำหรับ Racing Game Station</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Supabase-2.89-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" /></a>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css" alt="TailwindCSS" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Zustand-5.0-6366f1?style=flat-square" alt="Zustand" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-1.1.0-blue?style=flat-square" alt="Version" /></a>
</p>

---

## 📖 Overview

**Racing Game Station** คือระบบจองเวลาเล่นเกมแข่งรถและจัดการคิวหน้าร้าน ครอบคลุมตั้งแต่การจองล่วงหน้า (advance booking) การรับคิว walk-in การคิดเงินตามเวลาที่เล่นจริง และแดชบอร์ดควบคุมห้องเกมสำหรับพนักงาน

ระบบยังมี **LINE OA Chat** เป็นช่องทางสั่งงานภายในสำหรับผู้ดูแล ให้ถามสถานะเครื่อง คิว และการจองผ่านแชทได้

---

## ✨ Features

| ฟีเจอร์ | รายละเอียด |
|---------|------------|
| 🎮 **จองเวลาล่วงหน้า** | เลือกเครื่อง + วัน + ช่วงเวลา (คิวละ 30 นาที) พร้อมคำนวณราคาอัตโนมัติ |
| 🚶 **Walk-in Queue** | รับคิวหน้าร้าน ออกเลขคิวอัตโนมัติ แสดงจำนวนคิวหน้าและเวลารอโดยประมาณ |
| ⏱️ **Session-based Billing** | เริ่ม/จบเซสชันจริงบนเครื่อง คิดเงินตามเวลาจริง (`sessions`) ไม่ใช่เวลาที่จอง |
| 🖥️ **แดชบอร์ดหลังบ้าน** | 6 แท็บ: เครื่อง / คิว / เซสชัน / การจอง / ลูกค้า / สรุป |
| 🎛️ **ห้องควบคุมเกม** | หน้าเต็มจอสำหรับเริ่มเซสชันจากคิว จากการจอง หรือ manual |
| 👥 **จัดการลูกค้า** | ค้นหา/กรอง/แบ่งหน้า, ติดแท็ก VIP, นับจำนวนครั้งที่มาเล่น |
| 📊 **สถิติรายได้** | รายได้รวม / ชำระแล้ว / ค้างชำระ จาก sessions |
| 💬 **LINE OA Chat** | ผู้ดูแลถามสถานะผ่าน LINE OA ได้ (ปิดเป็นค่าเริ่มต้น) |
| 🌙 **Dark Mode** | สลับได้ พร้อมธีมสี accent สำหรับหน้าควบคุม |
| 📱 **Responsive** | ใช้งานได้ทั้งมือถือและจอใหญ่ |
| 🔐 **Authentication** | Supabase Auth — Email/Password (+OTP, OAuth เตรียมไว้แต่ปิด) |

---

## 🖥️ Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>🏠 Home Page</strong></td>
      <td align="center"><strong>🎮 Booking History</strong></td>
    </tr>
    <tr>
      <td><img src="docs/screenshots/home.png" alt="Home" width="400"/></td>
      <td><img src="docs/screenshots/customer.png" alt="Booking History" width="400"/></td>
    </tr>
    <tr>
      <td align="center"><strong>⚙️ Backend Dashboard</strong></td>
      <td align="center"><strong>🎛️ Game Room Control</strong></td>
    </tr>
    <tr>
      <td><img src="docs/screenshots/backend.png" alt="Backend" width="400"/></td>
      <td><img src="docs/screenshots/control.png" alt="Control" width="400"/></td>
    </tr>
  </table>
</div>

---

## 🏗️ Architecture

โปรเจคนี้ใช้ **Clean Architecture + Presenter Pattern**

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  app/ (routing only) · components/ · presenters/ · stores/      │
│                                                                  │
│  page.tsx (Server)                                             │
│      │  createServerXPresenter()  →  getViewModel()             │
│      ▼                                                           │
│  XPresenterServerFactory ──► Supabase*Repository                │
│      │                                                           │
│      ▼  props: initialViewModel                                 │
│  XView (Client) ──useXPresenter()──► XPresenterClientFactory    │
│      │                                └─► Api*Repository         │
│      ▼                                        │  fetch           │
│  View state / UI                      ┌────────▼─────────┐       │
└────────────────────────────────────────│  app/api/**     │───────┘
                                         │  (Route Handlers)│
                                         └────────┬─────────┘
                                                  │ Supabase (anon + cookie)
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                          │
│  src/application/repositories/I*Repository.ts  (9 interfaces)   │
│  src/application/services/ChatService.ts                         │
└─────────────────────────────────────────────────────────────────┘
```

### หลักการสำคัญ

1. **`app/` ทำหน้าที่ routing เท่านั้น** — ไม่มี business logic, ไม่มีการเรียก DB ตรง
2. **Presenter แยก business logic ออกจาก UI** — View เป็นแค่ render
3. **Repository Interface** อยู่ที่ Application layer, Implementation อยู่ที่ Infrastructure
4. **Client ใช้ Api\*Repository** (ผ่าน `/api/*`) เพื่อเลี่ยงปัญหา connection pool ของ Supabase บน browser
5. **Server ใช้ Supabase\*Repository** โดยตรง (anon key + cookie session, บังคับใช้ RLS)
6. **ทุก query ที่ต้องการอนุธรรมผ่าน PostgreSQL RPC** (`SECURITY DEFINER`) เพื่อซ่อน logic และควบคุมสิทธิ์ฝั่ง DB

> **หมายเหตุเรื่อง Service Role:** โปรเจคนี้ **ไม่มีการใช้ `SUPABASE_SERVICE_ROLE_KEY` ในโค้ด** — ทุกอย่างรันด้วย anon key + RLS + RPC guards ตัวแปรนี้มีไว้แค่ใน `.env.example` (ยังไม่ได้ใช้)

### Presenter Pattern

แต่ละ feature มี 1 presenter class (plain class ไม่มี React) + factories + hook:

```
src/presentation/presenters/backend/
├── BackendPresenter.ts                 # business logic (รับ repo ผ่าน constructor)
├── BackendPresenterClientFactory.ts    # 'use client' → Api*Repository
├── BackendPresenterServerFactory.ts    # async → Supabase*Repository
├── ControlPresenter.ts                 # presenter ที่ 2 ของ backend
└── useBackendPresenter.ts              # hook: useState + return [state, actions]
```

**การแยก Client/Server ไม่ได้เกิดจาก runtime check** — ไม่มี `typeof window` ในการเลือก factory แต่อย่างใด แต่เกิดจาก **โครงสร้างของ RSC boundary**:

1. `page.tsx` (Server Component) เรียก `createServer*Presenter()` → `getViewModel()`
2. ส่งผลลัพธ์เป็น prop `initialViewModel` ลงไป
3. `use*Presenter` รับ prop นั้นเป็น state เริ่มต้น และข้ามการโหลดซ้ำ (ถ้ามี)

หน้าที่ไม่มี server factory (control, customers, timeBooking, walkIn) จะโหลดข้อมูลฝั่ง client เสมอ

| Presenter | Client factory | Server factory | ใช้ repo |
|-----------|---------------|----------------|----------|
| `AuthPresenter` | ✅ `SupabaseAuthRepository` | ✅ *(ไม่ถูกเรียก)* | auth |
| `BackendPresenter` | ✅ `Api*` ×5 | ✅ | machine, walkIn, session, booking, storage |
| `ControlPresenter` | ✅ ผ่าน `RepositoryFactory` | ❌ | machine, session, booking, walkIn |
| `BookingPresenter` | ✅ `Api*` ×2 | ✅ *(ไม่ถูกเรียก)* | booking, machine |
| `CustomersPresenter` | ✅ `Api*` | ❌ | customer |
| `HomePresenter` | ✅ `Api*` ×4 | ✅ | machine, walkIn, booking, dashboard |
| `ProfilePresenter` | ✅ `SupabaseAuthRepository` | ✅ | auth |
| `TimeBookingPresenter` | ✅ `Api*` ×3 | ❌ | booking, machine, customer |
| `WalkInPresenter` | ✅ ผ่าน `RepositoryFactory` | ❌ | walkIn, machine |



---

## 📁 Project Structure

```
racing-game-station-nextjs/
├── app/                                # Next.js App Router (routing only)
│   ├── layout.tsx                      # Root layout: providers + MainLayout
│   ├── page.tsx                        # Home (Server Component, force-dynamic)
│   ├── loading.tsx / not-found.tsx
│   ├── (docs)/docs/                    # คู่มือใช้งานในเว็บ (customer/admin/game-control/print)
│   ├── api/                            # 28 Route Handlers
│   │   ├── bookings/        (+ [id], my-bookings, schedule)
│   │   ├── chat/            (+ action, message, webhook, welcome)
│   │   ├── customers/       (+ [id])
│   │   ├── dashboard/stats/
│   │   ├── machines/        (+ [id])
│   │   ├── sessions/        (+ [id], [id]/amount, [id]/end, [id]/payment, active, stats, today)
│   │   ├── storage/upload/
│   │   └── walk-in-queue/   (+ [id], [id]/call, my-status, next-number, stats)
│   ├── auth/                          # login / register / forgot / reset / verify / confirm / callback
│   ├── backend/                       # /backend, /backend/control (protected)
│   ├── customer/                      # booking-status, booking-history
│   ├── profile/                       # (protected)
│   ├── privacy/ · terms/ · qa-checklist/ · qr-scan/ · time-booking/ · walk-in/
│
├── src/
│   ├── application/
│   │   ├── repositories/               # 9 interface files + domain types
│   │   └── services/ChatService.ts
│   ├── domain/types/                   # chatTypes.ts, supabase.ts (generated)
│   ├── infrastructure/
│   │   ├── line/LineMessagingService.ts
│   │   ├── repositories/
│   │   │   ├── RepositoryFactory.ts
│   │   │   ├── api/                    # 7 Api*Repository — ใช้บน client
│   │   │   ├── mock/                   # 2 Mock*Repository — ยังไม่ถูก wire เข้าที่ใด
│   │   │   └── supabase/               # 9 Supabase*Repository — ใช้บน server
│   │   └── supabase/                   # client.ts (browser), server.ts (cookie-based)
│   ├── lib/date.ts                     # dayjs + timezone helpers
│   ├── presentation/
│   │   ├── components/                 # 49 components (auth/backend/booking/chat/...)
│   │   ├── hooks/useTimezoneCheck.ts
│   │   ├── presenters/                 # 9 presenter families
│   │   │   ├── auth/ · backend/ · booking/ · customers/
│   │   │   ├── home/ · profile/ · timeBooking/ · walkIn/
│   │   │   └── └─── {X}Presenter.ts, XPresenterClientFactory.ts,
│   │   │        XPresenterServerFactory.ts, useXPresenter.ts
│   │   ├── providers/                  # ThemeProvider (AuthProvider — ยังไม่ได้ mount)
│   │   └── stores/                     # Zustand: auth / chat / customer / controlTheme / qaChecklist
│   └── config/                         # auth · booking · customer · machine · navigation config
│
├── supabase/
│   ├── config.toml                     # local dev ports + seed path
│   ├── migrations/                     # 10 migration files
│   ├── seeds/000-init_seed.sql         # auth users + profiles + machines
│   └── seeds_mock/000-init_seed.sql    # ⚠️ ยังรันไม่ได้ (ดู Known Issues)
│
├── scripts/                            # bash deploy scripts + test-api.ts
├── public/styles/                      # 5 CSS files (Tailwind v4 entry)
└── docs/                               # DEPLOYMENT.md, audit/, plan/, walkthrough/
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x ขึ้นไป
- **Supabase CLI** — `brew install supabase/tap/supabase` (สำหรับ local dev)
- **Vercel CLI** — `npm i -g vercel` (สำหรับ deploy เท่านั้น)

### Installation

```bash
# 1. Clone
git clone <your-repo-url>
cd racing-game-station-nextjs

# 2. Install dependencies
npm install

# 3. สร้างไฟล์ env (setup:env จะ copy .env.example → .env.local ให้ถ้ายังไม่มี)
npm run setup:env

# 4. Start local Supabase (ต้องมี Docker Desktop ทำงานอยู่)
npm run supabase-start

# 5. Reset DB = run migrations + seed
npm run supabase-reset

# 6. Start dev server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

**บัญชีทดสอบจาก seed** (รหัสผ่านทั้งหมด `12345678`):

| Email | หมายเหตุ |
|-------|----------|
| `admin@racing.com` | โปรไฟล์ `admin_personal` — ดู [Known Issues](#-known-issues--สิ่งที่ยังต้องแก้) เรื่อง role |
| `user1@racinggamestation.com` | โปรไฟล์ `user1_gaming` |
| `user2@racinggamestation.com` | โปรไฟล์ `user2_tech` |

> ⚠️ บัญชีจาก seed เป็นบัญชีสาธิต ห้าม seed ลง production ที่มีข้อมูลจริงอยู่แล้ว

---

## 📝 Scripts

| Script | คำอธิบาย |
|--------|----------|
| **Development** ||
| `npm run dev` | Dev server (Turbopack) |
| `npm run dev-c` | ล้าง `.next` แล้ว dev ใหม่ |
| `npm run build` | Production build (Turbopack) |
| `npm run start` | รัน production build |
| `npm run type-check` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| **Supabase** ||
| `npm run supabase-start` | `supabase start` |
| `npm run supabase-stop` | `supabase stop` |
| `npm run supabase-reset` | `supabase reset` — ล้าง DB + รัน migrations + seed |
| `npm run supabase-migrate` | alias ของ `supabase db reset` |
| `npm run supabase-generate` | gen types → `src/domain/types/supabase.ts` |
| `npm run supabase-db-diff` | ตรวจ drift ระหว่าง local กับ schema |
| **Deploy** ||
| `npm run deploy:supabase` | `deploy-supabase.sh push` — push migrations |
| `npm run deploy:supabase:status` | ดู migration files + db diff |
| `npm run deploy:vercel` | `deploy-vercel.sh production` — type-check + build + deploy |
| `npm run deploy:vercel:preview` | เหมือนข้างบนแต่ deploy preview |
| `npm run deploy:all` | orchestrate 4 ขั้นตอน (ถาม yes/no ทีละขั้น) |
| **Setup** ||
| `npm run setup:env` | ตรวจ env สำหรับ local |
| `npm run setup:env:prod` | ตรวจ env vars ที่จำเป็นสำหรับ production (fail ถ้าขาด) |
| **Test** ||
| `npm run test:api` | integration test 13 เคส (ต้องเปิด dev server ก่อน) |

---

## 🌐 Environment Variables

อ้างอิงเต็ม: [`.env.example`](.env.example) · คู่มือ deploy: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

### จำเป็น

| Variable | ใช้ทำอะไร |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key (public — ใช้ทั้ง browser และ server) |

### สำหรับ local Supabase

| Variable | ค่า |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` |

### Optional — ยังไม่ถูกใช้ในโค้ด

| Variable | หมายเหตุ |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | ประกาศไว้ใน `.env.example` แต่ **ไม่มีโค้ดอ่าน** |
| `EMAIL_*` | ประกาศไว้แต่ไม่มีโค้ดส่งอีเมล |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | ยังไม่ได้ต่อ |
| `NEXT_PUBLIC_CLOUDINARY_*` | ยังไม่ได้ต่อ |

### Feature Toggles

| Variable | ค่าเริ่มต้น | ผล |
|----------|-----------|-----|
| `NEXT_PUBLIC_AUTH_EMAIL_ENABLED` | `true` | เปิด/ปิด login ด้วยอีเมล |
| `NEXT_PUBLIC_AUTH_REGISTRATION_ENABLED` | `false` | อนุญาตให้สมัครสมาชิกใหม่ |
| `NEXT_PUBLIC_AUTH_EMAIL_VERIFICATION_ENABLED` | `true` | ต้องยืนยันอีเมลก่อนใช้งาน |
| `NEXT_PUBLIC_AUTH_FORGOT_PASSWORD_ENABLED` | `true` | เปิดปุ่มลืมรหัสผ่าน |
| `NEXT_PUBLIC_AUTH_PHONE_ENABLED` | `false` | login ด้วย OTP |
| `NEXT_PUBLIC_AUTH_OAUTH_ENABLED` | `false` | login ด้วย Google/Facebook/GitHub/LINE |
| `NEXT_PUBLIC_ENABLE_CHAT_WIDGET` | `false` | แสดง ChatWidget ลอยมุมจอ (`/backend`) |

### LINE OA (ต้องเปิด Chat)

| Variable | ที่มาจาก |
|----------|---------|
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Developers Console |
| `LINE_CHANNEL_SECRET` | LINE Developers Console (ใช้ verify HMAC webhook) |

### Inject โดย `next.config.ts` (ไม่ต้องตั้งเอง)

| Variable | ที่มาจาก |
|----------|---------|
| `NEXT_PUBLIC_APP_VERSION` | `package.json` version |
| `NEXT_PUBLIC_COMMIT_SHA` | `VERCEL_GIT_COMMIT_SHA` หรือ `git rev-parse HEAD` |

> ⚠️ เขียนค่า string ใน `.env` **อย่าใส่เครื่องหมายคำพูด** — `NEXT_PUBLIC_APP_NAME="Racing Game Station"` จะกลายเป็นค่าที่มี quote ติดไปด้วย

---

## 🎯 Routes

### หน้าเว็บ

| Route | หน้า | เข้าถึง |
|-------|------|--------|
| `/` | หน้าแรก — สรุปเครื่อง/สถิติวันนี้ | สาธารณะ |
| `/time-booking` | จองเวลาล่วงหน้า | สาธารณะ |
| `/customer/booking-status` | สถานะการจองของฉัน (ตามเบอร์โทร) | สาธารณะ |
| `/customer/booking-history` | ตารางจองย้อนหลัง/ล่วงหน้า 7 วัน | สาธารณะ |
| `/customer` | → redirect ไป `/customer/booking-history` | สาธารณะ |
| `/walk-in` | เข้าคิว walk-in (มีทั้งฟอร์มเข้าคิวและแผงแสดงสถานะในหน้าเดียว) | สาธารณะ |
| `/qr-scan` | สแกน QR เพื่อจอง/เช็คอิน | สาธารณะ |
| `/backend` | แดชบอร์ดผู้ดูแล (6 แท็บ) | 🔒 ต้อง login |
| `/backend/control` | ห้องควบคุมเกม (full-screen) | 🔒 ต้อง login |
| `/profile` | โปรไฟล์ผู้ใช้ | 🔒 ต้อง login |
| `/auth/login` · `/register` · `/forgot-password` · `/reset-password` · `/verify-email` | ระบบล็อกอิน | สาธารณะ |
| `/auth/callback` · `/auth/confirm` | OAuth callback / verify email link | สาธารณะ |
| `/privacy` · `/terms` | นโยบายความเป็นส่วนตัว / เงื่อนไขการใช้บริการ | สาธารณะ |
| `/docs` · `/docs/customer` · `/docs/admin` · `/docs/game-control` · `/docs/print` | คู่มือใช้งานในเว็บ | สาธารณะ |
| `/qa-checklist` | เครื่องมือ QA checklist (บันทึกลง localStorage) | สาธารณะ |

> 🔒 การป้องกันทำที่ `middleware.ts` — redirect ไป `/auth/login?redirectTo=...` เมื่อไม่มี session

### API Routes (28)

| Prefix | Methods | หมายเหตุ |
|--------|---------|----------|
| `/api/bookings` | GET, POST | `?action=availableDates\|stats\|by-machine-and-date\|by-date` |
| `/api/bookings/[id]` | GET, PUT | PUT รองรับ `action:'cancel'` |
| `/api/bookings/my-bookings` | GET | `?customerId=` |
| `/api/bookings/schedule` | GET, POST | ตารางช่วงเวลาว่างของเครื่อง+วัน |
| `/api/customers` | GET, POST | `?action=stats\|vip\|frequent`, POST `createOrUpdateCustomer` |
| `/api/customers/[id]` | GET, PUT, DELETE | PUT รองรับ `action:'incrementVisit'` |
| `/api/dashboard/stats` | GET | สถิติหน้าแรก |
| `/api/machines` | GET, POST | `?action=available\|stats\|dashboard` |
| `/api/machines/[id]` | GET, PUT, DELETE | PUT รองรับ `action:'updateStatus'` |
| `/api/sessions` | GET, POST | เริ่มเซสชัน |
| `/api/sessions/[id]` | GET | |
| `/api/sessions/[id]/end` | POST | จบเซสชัน + คำนวณยอดเงิน |
| `/api/sessions/[id]/payment` | PUT | เปลี่ยนสถานะการชำระเงิน |
| `/api/sessions/[id]/amount` | PUT | แก้ยอดเงินเอง |
| `/api/sessions/active` · `/today` · `/stats` | GET | |
| `/api/storage/upload` | POST | multipart: `file`, `bucket`, `pathPrefix` |
| `/api/walk-in-queue` | GET, POST | เข้าคิว / ดูคิวรอ |
| `/api/walk-in-queue/[id]` | GET, PUT | PUT = `action:'cancel'` |
| `/api/walk-in-queue/[id]/call` | POST | เรียกคิว (admin) |
| `/api/walk-in-queue/my-status` · `/next-number` · `/stats` | GET | |
| `/api/chat/message` · `/action` · `/welcome` | POST/GET | 🔒 ต้องเป็น admin/moderator |
| `/api/chat/webhook` | POST | LINE OA webhook (ตรวจ HMAC `x-line-signature`) |

---

## 🛠️ Tech Stack

| หมวด | เทคโนโลยี |
|------|----------|
| **Framework** | Next.js 16.1 (App Router, Turbopack) |
| **UI** | React 19.2 |
| **Language** | TypeScript 5 (`strict: true`) |
| **Styling** | TailwindCSS v4 (`@theme` tokens + CSS custom properties) |
| **State** | Zustand 5 (+ `persist` middleware) |
| **Database** | Supabase PostgreSQL (10 migrations, 7 tables, 39 functions) |
| **Auth** | Supabase Auth (Email/Password, OTP, OAuth — เตรียมไว้) |
| **Storage** | Supabase Storage (3 buckets) |
| **Chat** | LINE Messaging API + Web Chat Widget |
| **Dates** | dayjs + timezone plugin |
| **Animation** | `@react-spring/web`, Tailwind keyframes |
| **Theming** | next-themes (dark mode) + custom accent token system |
| **QR** | `qrcode.react` |
| **Icons/QR print** | `react-to-print` |

---

## 💾 Database

### ตาราง (7)

| ตาราง | หน้าที่ |
|-------|--------|
| `profiles` | โปรไฟล์ผู้ใช้ (ผูก `auth.users`) — รองรับหลายโปรไฟล์ต่อคน |
| `profile_roles` | บทบาท: `user` / `moderator` / `admin` |
| `machines` | เครื่องเล่น + สถานะ + ราคาต่อชั่วโมง |
| `customers` | ข้อมูลลูกค้า (เบอร์โทร = identity key, VIP, จำนวนครั้งที่มา) |
| `bookings` | การจองล่วงหน้า + generated columns สำหรับคิวตามเวลาร้าน |
| `walk_in_queue` | คิวหน้าร้าน (เลขคิว, party size, สถานะ waiting→called→seated) |
| `sessions` | **การใช้งานเครื่องจริง** — ตัวหนึ่งที่คิดเงิน |

### Enum

| Enum | ค่า |
|------|-----|
| `machine_status` | `available` · `occupied` · `maintenance` |
| `booking_status` | `pending` · `confirmed` · `checked_in` · `seated` · `completed` · `cancelled` |
| `walk_in_status` | `waiting` · `called` · `seated` · `cancelled` |
| `payment_status` | `unpaid` · `paid` · `partial` |
| `profile_role` | `user` · `moderator` · `admin` |

### ความสัมพันธ์

```
machines ──┬──< bookings >── customers >── profiles >── auth.users
           │        │            │            └──< profile_roles
           │        │            └── (profile_id, nullable สำหรับ guest)
           │        │
           ├──< walk_in_queue ──┘
           │
           └──< sessions >──── booking_id? / queue_id?
                       (NULL = manual session)
```

### จุดสำคัญ

- **`sessions` คือแหล่งความจริงของรายได้** — คิดเงินจากเวลาที่เล่นจริง ไม่ใช่เวลาที่จอง
- **`bookings` ใช้ generated columns** (`local_date`, `local_start_time`, `is_cross_midnight`) คำนวณจาก `business_timezone` → query ตามวันเวลาร้านได้เร็วโดยไม่ต้องแปลง timezone ทุกครั้ง
- **ราคาคำนวณ 2 ชั้น**: `calculate_booking_total_price()` trigger คิดตอนจอง (`CEIL(minutes/60) × hourly_rate`), ส่วน `rpc_end_session()` คิดตอนจบเซสชัน
- **ทุกการเขียนผ่าน `SECURITY DEFINER` RPC** — ไม่มี client เขียนตารางตรง

### RPC หลัก

| กลุ่ม | ฟังก์ชัน |
|-------|----------|
| **Machines** | `rpc_get_active_machines()` |
| **Bookings** | `rpc_create_booking` · `rpc_cancel_booking` · `rpc_checkin_booking` · `rpc_get_bookings_schedule` · `rpc_get_my_bookings` · `rpc_get_bookings_by_date` · `rpc_get_bookings_by_machine_date` · `rpc_is_booking_slot_available` · `rpc_get_booking_stats` |
| **Walk-in** | `rpc_join_walk_in_queue` · `rpc_call_queue_customer` · `rpc_cancel_walk_in_queue` · `rpc_get_waiting_queue` · `rpc_get_my_walk_in_queue` · `rpc_get_walk_in_queue_stats` |
| **Sessions** | `rpc_start_session` · `rpc_end_session` · `rpc_update_session_payment` · `rpc_update_session_amount` · `rpc_get_active_sessions` · `rpc_get_today_sessions` · `rpc_get_session_stats` · `rpc_get_backend_stats` |
| **Customers** | `rpc_get_all_customers_admin` · `create_or_update_customer` |
| **Dashboard** | `rpc_get_home_dashboard_stats` |
| **Profiles** | `get_active_profile` · `get_user_profiles` · `set_profile_active` · `get_profile_role` · `get_active_profile_role` · `set_profile_role` · `create_profile` |
| **Users (admin)** | `get_paginated_users` · `get_auth_user_by_id` |
| **Helper** | `is_admin()` · `is_moderator_or_admin()` · `get_active_profile_id()` · `mask_phone()` · `get_private_url()` |

---

## 🎨 Theming

ระบบธีมแบ่งเป็น 2 ชั้น:

**ชั้นที่ 1 — Global theme** (ทั้งเว็บ) อยู่ใน [public/styles/theme.css](public/styles/theme.css)

| Token | ใช้ทำอะไร |
|-------|-----------|
| `--background` / `--foreground` | พื้นหลัง/ตัวอักษรหลัก |
| `--surface` / `--on-surface` | พื้นการ์ด |
| `--muted` / `--border` | ตัวอักษรรอง / เส้นขอบ |
| `--success` / `--warning` / `--error` / `--info` | สีสถานะ (มี `-light` / `-dark` สำหรับพื้นหลัง) |
| `--input` / `--input-bg` / `--input-placeholder` | ช่องกรอกข้อมูล |
| `--accent-purple` / `-cyan` / `-pink` / `-blue` / `-amber` / `-orange` / `-emerald` | สีเน้น |

Dark mode ใช้ class-based variant (`@custom-variant dark`) — สลับผ่าน `next-themes` (`ThemeProvider`) โดย toggle ที่ class `.dark` บน `<html>`

Utility gradient ที่สร้างไว้: `gradient-purple` · `gradient-cyan` · `gradient-pink` · `gradient-green` · `gradient-orange` (+ เวอร์ชัน `-bg` ที่เป็นพื้นหลัง)

**ชั้นที่ 2 — Control room theme** (เฉพาะ `/backend/control`) อยู่ใน `useControlThemeStore.ts`

5 ธีมที่สลับสดๆ ได้: `neutral` · `midnight` · `ocean` · `sunrise` · `neon` (persist ลง localStorage key `control-theme-storage`)

**ฟอนต์**: MiSans Thai (self-hosted ที่ `public/fonts/MiSans_Thai/`) ลงเป็น `--font-sans`

---

## 💵 ราคาและกติกาทางธุรกิจ

ราคาทั้งหมดอยู่ที่ [`src/config/booking.config.ts`](src/config/booking.config.ts) — แก้ที่เดียว ทั้งระบบเปลี่ยน

| ระยะเวลา | รหัส | ราคา | ต่อนาที |
|----------|------|------|--------|
| 30 นาที | WARM UP | ฿60 | ฿2.00 |
| 60 นาที | PRO RACE | ฿100 | ฿1.67 |
| 120 นาที | PRO RACE | ฿200 | ฿1.67 |
| 180 นาที | GRAND PRIX | ฿280 | ฿1.56 |

**Step pricing**: เกินเวลาเมื่อไร คิดเป็นขั้นบน (เช่น 45 นาที → ฿100 ไม่ใช่ ฿90) เกินขั้นสูงสุดแล้วคิดต่อนาทีด้วยเรทที่ถูกที่สุด

**เวลาทำการ**: `OPERATING_HOURS` = เปิด 10:00–22:00 แต่มี `isOpen24Hours: true` ซึ่ง override `open`/`close` → ระบบเปิดตลอด 24 ชม. ปรับเป็นเปิดปิดตามเวลาต้องแก้ flag นี้

**ช่วงเวลา**: คิวละ 30 นาที (`slotDurationMinutes`)

**กติกาลูกค้า** ([`customerConfig.ts`](src/config/customerConfig.ts)):

| ค่า | ความหมาย |
|-----|----------|
| `REGULAR_CUSTOMER_MIN_VISITS: 3` | มา 3 ครั้งขึ้นไป = ลูกค้าประจำ (ใช้กรอง + แสดง badge) |
| `AUTO_VIP_THRESHOLD: 0` | ปิดไว้ — VIP ต้องตั้งเองจากแท็บลูกค้า |

**Validation** (`BOOKING_VALIDATION`): เบอร์โทร 9–10 หลัก, ชื่อ 2–100 ตัวอักษร

**Timezone**: `TIMEZONE_CONFIG.defaultBusinessTimezone = 'Asia/Bangkok'` — เปลี่ยนร้าน/ประเทศต้องแก้ตรงนี้ ทุก query วันที่ในระบบอิงตามเวลาร้าน

---

## 🗃️ Zustand Stores

| Store | State | Persist |
|-------|-------|---------|
| `useAuthStore` | session / user / profile / isAuthenticated | ❌ (in-memory, เติมฝั่ง client เท่านั้น) |
| `useCustomerStore` | customerInfo + activeBookings + bookingHistory + activeWalkIn | ✅ `racing-gamestation-customer` (history จำกัด 50 รายการ) |
| `useChatStore` | messages / isOpen / isLoading | ❌ (ถือ `ApiChatRepository` ไว้ที่ module scope) |
| `useControlThemeStore` | currentTheme จาก 5 ธีม | ✅ `control-theme-storage` |
| `useQAChecklistStore` | testCases (~22 เคส) + notes | ✅ `qa-checklist-storage` (ไม่มี guard `isInitialized` เหมือนตัวอื่น) |

---

## 🧪 Testing

```bash
npm run type-check    # tsc --noEmit
npm run lint          # eslint
npm run build         # build + type check
```

### Integration test

```bash
npm run dev           # เปิด server ก่อน (terminal แยก)
npm run test:api      # 13 เคส
```

สคริปต์ทดสอบเป็น **anonymous** (ไม่ส่ง Authorization header) และยิงแบบ `fetch` ตรง ๆ ใช้ `TEST_URL` override ได้:

```bash
TEST_URL=https://your-app.vercel.app npm run test:api
```

ครอบคลุม: machines, bookings schedule, walk-in queue (create → read → call → cancel), sessions (list/active/today/stats)

> ⚠️ เคส walk-in เป็นลำดับ — ถ้า `POST /api/walk-in-queue` ล้มเหลว เคสถัดไป 3 จะ fail ตาม (cascade) และเคส `call` คาดหวัง `500 || ok` เพราะ anonymous เรียก RPC ที่ต้องเป็น admin

---

## 🔒 Security

### ชั้นที่มีอยู่

- **RLS** เปิดทุกตารางใน `public`
- **`SECURITY DEFINER` RPC** ตรวจ `is_moderator_or_admin()` ภายในตัวฟังก์ชัน ก่อนทำรายการอนุธรรม
- **Middleware** ป้องกัน `/backend` และ `/profile`
- **`mask_phone()`** ซ่อนเบอร์โทรในคิวสาธารณะ (`081-XXX-5678`)
- **`pg_advisory_xact_lock`** กัน race condition ตอนสร้าง customer/booking ด้วยเบอร์เดียวกัน
- **LINE webhook** ตรวจ HMAC-SHA256 signature ก่อนประมวลผล

### ⚠️ ช่องโหว่ที่พบ (ดูรายละเอียดใน Known Issues)

- `rpc_get_my_bookings` / `rpc_get_my_walk_in_queue` เป็น `SECURITY DEFINER` ที่ grant ให้ `anon` แต่**ไม่ตรวจ ownership** — ถ้ารู้ `customer_id` จะเห็นข้อมูลลูกค้าคนนั้นได้
- `/api/*` **ไม่ถูก middleware ป้องกัน** — ปล่อยให้ทุกคนยิงได้ (พึ่ง RLS/RPC เป็นด่านสุดท้าย)
- RPC ที่ grant ให้ `anon` อย่าง `rpc_get_active_sessions` คืนชื่อลูกค้า/เครื่อง/ยอดเงินของ session ที่ยังเล่นอยู่
- `/api/storage/upload` รับ `bucket` จาก request โดยไม่มี allowlist และไม่ตรวจ MIME/ขนาด
- `zod` ติดตั้งไว้แต่ **ไม่ถูก import ที่ไหนเลย** — validation ทำมือ (`if (!field)`) หรือไม่ทำ

---

## ⚠️ Known Issues

รายการนี้ค้นพบจากการอ่านโค้ดล่าสุด — **ยังไม่ได้แก้**

### Seed ไม่ได้ grant role ให้ admin

`supabase/seeds/000-init_seed.sql` insert `profiles` ทุกแถวด้วย `is_active = FALSE` แต่โค้ด grant role ใช้ `WHERE p.is_active = true` → **ไม่มีแถวไหนผ่าน** ผลคือ `admin@racing.com` ไม่มี role `admin` และต้องกด "เปิดใช้งานโปรไฟล์" (`set_profile_active`) ก่อนถึงจะเป็น admin ได้

### `seeds_mock` รันไม่ได้

`supabase/seeds_mock/000-init_seed.sql` อ้างตาราง `public.queues` และ type `public.queue_status` ซึ่ง**ไม่มีอยู่จริง** (schema ปัจจุบันใช้ `walk_in_queue` + `walk_in_status`) ไฟล์นี้ไม่ถูก `config.toml` อ้างอิงอยู่แล้ว

### ช่องโหว่ ownership ใน RPC

`rpc_get_my_bookings(p_customer_id)` และ `rpc_get_my_walk_in_queue(p_customer_id)` เป็น `SECURITY DEFINER` + grant ให้ `anon` + **ไม่ตรวจว่าผู้เรียกเป็นเจ้าของ** → เดา UUID เพื่ออ่านข้อมูลลูกค้ารายอื่นได้ (ดู [Security](#-security) ด้านบน)

### `storage.sign_url()` ไม่มีอยู่จริง

`get_private_url()` ใน migration `20250618000003_storage.sql` เรียก `storage.sign_url(...)` ซึ่งไม่ใช่ชื่อฟังก์ชันจริง (ที่ถูกคือ `storage.create_signed_url`) → จะ error ตอนรัน

### `/api/storage/delete` ไม่มีอยู่

`ApiStorageRepository.deleteFile()` เรียก `POST /api/storage/delete` แต่มีแค่ `app/api/storage/upload/` — เรียกแล้วได้ 404

### RepositoryFactory ไม่ได้เลือก implementation

`RepositoryFactory.ts` hardcode `Api*Repository` ทั้งหมด ไม่มี logic เลือก Supabase/Mock/Api — ชื่อ "Factory" ทำให้เข้าใจผิดว่ามีการเลือก implementation

### Mock repository ไม่ถูกใช้

`MockCustomerRepository` และ `MockMachineRepository` ไม่มี import จากที่ไหนเลย (ยืนยันด้วย grep)

### `AuthProvider` ไม่ถูก mount

`src/presentation/providers/AuthProvider.tsx` มีอยู่แต่ไม่มีไฟล์ไหน import — `app/layout.tsx` mount แค่ `ThemeProvider`

### Server factory 2 ตัวเป็น dead code

`AuthPresenterServerFactory.ts` และ `BookingPresenterServerFactory.ts` ถูกสร้างไว้แต่ไม่มี page ไหนเรียก (grep ยืนยัน 0 call site) มีแค่ 3 ตัวที่ใช้งานจริง: Home, Backend, Profile

### Component บางตัวข้าม presenter layer

3 component เรียก `RepositoryFactory` จากใน presentation layer โดยตรง แทนที่จะผ่าน presenter:

| Component | เรียกอะไร |
|-----------|----------|
| `BookingHistoryView` | `createBookingRepositories()` → `getAll` / `getDaySchedule` / `getByMachineAndDate` |
| `BookingStatusView` | `createBookingRepository()` → `getMyBookings` / `cancel` |
| `BookingsTab` | `createBookingRepositories()` → `update` / `cancel` |

**ยังไม่มีกลไกบังคับ**: `eslint.config.mjs` มีแค่ `eslint-config-next` (ไม่มี `no-restricted-imports`) และ `tsconfig.json` map `@/*` → รากโปรเจค (ไม่ใช่ `src/`) → layer ไหน import layer ไหนก็ผ่าน

### Component ที่ไม่มีใครเรียกใช้

`BookingView.tsx` (ถูกแทนที่ด้วย `TimeBookingView`) · `QueueDetailModal.tsx` · `TimezoneNoticeCompact` / `TimezoneNoticeFloating`

### God component

`ControlView.tsx` = 1,264 บรรทัด ฝัง sub-component ไว้ 7 ตัว และมี map `THEME_STYLES` ของ Tailwind class ที่ซ้ำกับ `TailwindPreloader.tsx` (ต้อง sync กันเองด้วยมือ)

### บันทึก state ของผู้ใช้อยู่ใน localStorage

`useCustomerStore` persist เบอร์โทร + ประวัติการจองลง localStorage (key `racing-gamestation-customer`) — **ข้อมูลส่วนตัวอยู่บนเครื่องลูกค้า** ไม่ได้อยู่ใน session ที่ล้างได้ฝั่ง server

### Bug เล็กๆ

- `useWalkInPresenter.ts` เรียก `createClientWalkInPresenter()` แต่**ไม่มี `'use client'`** — hook ตัวเดียวที่ขาด directive
- `ImageUploadInput.tsx` มี `useState`/`useRef` แต่ไม่มี `'use client'`
- `App/loading.tsx` ไม่มี `error.tsx` / `global-error.tsx` — error ใน Server Component จะไม่มี UI สำรอง
- `page-fade` keyframe กับชื่อ class `.animate-page-in` ไม่ตรงกัน
- `fonts.css` มี weight ซ้ำ (400 และ 600) ตัวหลังทับตัวก่อน
- `theme.css` comment บอกว่า accent เหมือนเดิมทั้งสองโหมด แต่ค่าจริงเปลี่ยนทุกตัว

### Dependencies ที่ไม่ถูกใช้

ติดตั้งใน `package.json` แต่ไม่มี import ในโค้ดเลย: `axios` · `zod` · `html2canvas` · `prismjs` · `@types/prismjs` · `react-hook-form` · `@uidotdev/usehooks` · `clsx` · `localforage` · `react-spring` (แพ็กเกจแยก — ใช้แค่ `@react-spring/web`)

### อื่นๆ

- `Customer.phone` **ไม่มี `UNIQUE` constraint** แม้ RPC ทุกตัวจะใช้มันเป็น identity key
- `getAvailableDates()` ไม่ query DB เลย — generate วันที่ 7 วันใน TS
- `SupabaseCustomerRepository.getStats()` select ลูกค้า**ทั้งหมด**แล้วค่อยกรองใน JS
- `useAuthStore` **ไม่ persist** และเติมค่าฝั่ง client เท่านั้น → server อ่าน `isAuthenticated` ได้แค่ `false` เสมอ
- `.claude/settings.local.json` **ไม่ถูก ignore** ใน `.gitignore` และมี API key อยู่ในนั้น
- `seeds_mock` ทำให้ `db reset` พัง เพราะ `config.toml` ชี้ `sql_paths = ["./seeds/*.sql"]` แต่ไฟล์ที่ seed จริงอยู่ใน `seeds/` — ถ้าใครย้ายไฟล์ผิดที่ reset จะ error
- `config.toml` ตั้ง `site_url = "http://127.0.0.1:3000"` แต่ `additional_redirect_urls = ["https://127.0.0.1:3000"]` — scheme ไม่ตรงกัน
- ไม่มีไฟล์ `LICENSE` (README เวอร์ชันก่อนอ้างอิงอยู่ — ลบการอ้างอิงแล้วในเวอร์ชันนี้)

---

## 📚 Documentation

| ไฟล์ | เนื้อหา |
|------|---------|
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | คู่มือ deploy ไป Vercel + Supabase ทีละขั้น |
| [`docs/audit/`](docs/audit/) | รายงานตรวจสอบความปลอดภัยรายหน้า (ม.ค. 2026 — **อาจล้าสมัยแล้ว**) |
| [`docs/audit/database/`](docs/audit/database/) | วิเคราะห์ RLS/RPC ของ bookings, sessions, walk_in_queue |
| [`docs/plan/`](docs/plan/) | แผนแก้ปัญหา / แบบออกแบบหน้า |
| [`docs/walkthrough/`](docs/walkthrough/) | สรุปงานที่ทำเสร็จแล้ว |
| [`prompt/CREATE_PAGE_PATTERN.md`](prompt/CREATE_PAGE_PATTERN.md) | เทมเพลตสร้างหน้าใหม่ตาม Clean Architecture |
| [`prompt/CREATE_REPO_PATTERN.md`](prompt/CREATE_REPO_PATTERN.md) | เทมเพลตสร้าง Repository ใหม่ (4 แบบ) |
| [`.agent/workflows/`](.agent/workflows/) | workflow สำหรับ AI agent |

---

## 🔀 Git Workflow

> 🔴 **ห้าม commit ลง `main` และ `develop` โดยตรง — ต้องสร้าง feature branch เสมอ**

### เปิดใช้ hook (ครั้งเดียวหลัง clone)

```bash
npm run setup:git-hooks
```

ติดตั้ง `pre-commit` hook ที่บล็อกการ commit บน `main` / `master` / `develop` โดยอัตโนมัติ

### Flow

```
feature/<slug>  ──►  develop  ──►  main
```

| Branch | push ตรงได้? | หมายเหตุ |
|--------|-------------|---------|
| `main` | ❌ | production — อัปเดตจาก `develop` เท่านั้น ผ่าน PR |
| `develop` | ❌ | integration — รับจาก feature branch เท่านั้น ผ่าน PR |
| `feature/*` `fix/*` `docs/*` `chore/*` `refactor/*` `test/*` `perf/*` | ✅ | ทำงานปกติ |

### เริ่มงานใหม่

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<slug>

# ... ทำงาน ...

git add <ไฟล์>
git commit -m "feat(scope): รายละเอียด"
git push -u origin feature/<slug>
```

### Hook บล็อกอะไร

| กรณี | ผล |
|------|-----|
| commit บน `main` / `master` / `develop` | ❌ บล็อก |
| ชื่อ branch นอก convention | ❌ บล็อก พร้อมบอกชื่อที่ควรใช้ |
| `feature/*` `fix/*` ฯลฯ | ✅ ผ่าน |
| commit message ว่าง | ❌ บล็อก |

ข้ามได้เมื่อจำเป็นจริง:

```bash
git commit --no-verify                        # ข้ามทั้งหมด
SKIP_BRANCH_CHECK=1 git commit -m "..."        # ข้ามแค่การตรวจชื่อ branch
```

### Commit message

ใช้ Conventional Commits:

```
<type>(<scope>): <รายละเอียด>

type:  feat | fix | docs | refactor | chore | perf | test | style
scope: booking | walk-in | auth | chat | theme | seed | ...
```

### แก้เมื่อ commit ผิดปกติ

```bash
git reset --soft HEAD~1              # ย้อน commit แต่เก็บการแก้ไข
git checkout -b fix/<slug>
git commit -m "<ข้อความเดิม>"
```

ถ้า push ไปแล้ว: `git push --force-with-lease origin develop`

รายละเอียดทั้งหมดและกฎการทำงานของ AI agent อยู่ที่ [`CLAUDE.md`](CLAUDE.md)

---

## 🤝 Contributing

1. Fork the repository
2. ตั้ง hook: `npm run setup:git-hooks`
3. สร้าง feature branch (`git checkout -b feature/your-feature`)
4. ทำตาม pattern ใน [`prompt/CREATE_PAGE_PATTERN.md`](prompt/CREATE_PAGE_PATTERN.md) ถ้าเพิ่มหน้าใหม่
5. รัน `npm run type-check && npm run lint && npm run build` ก่อน push
6. เปิด Pull Request เข้า `develop`

---

<p align="center">
  <strong>🏎️ Racing Game Station — จองเวลา ง่าย เร็ว ทันใจ</strong><br/>
  <sub>Built with ❤️ in Thailand</sub>
</p>
