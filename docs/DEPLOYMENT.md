# 🚀 Racing Game Station — Deployment Guide

คู่มือการนำระบบไปขึ้น Production (Vercel + Supabase)

> คู่มือนี้เขียนให้ตรงกับ `package.json` และโค้ดปัจจุบัน — ถ้าสคริปต์ใน `package.json` เปลี่ยน ให้แก้ไฟล์นี้ตาม

---

## 📋 Quick Reference

```bash
# ติดตั้ง CLI (ครั้งเดียว)
brew install supabase/tap/supabase   # Supabase CLI (แนะนำ)
npm i -g vercel                     # Vercel CLI

# Login
supabase login
vercel login

# Deploy ครบทุกอย่าง (ถามยืนยันทีละขั้น)
npm run deploy:all
```

---

## 📦 Prerequisites

| เครื่องมือ | ใช้ทำอะไร | ติดตั้ง |
|-----------|-----------|--------|
| Node.js 18+ | runtime | — |
| Docker Desktop | local Supabase | — |
| Supabase CLI | migrations, types, local DB | `brew install supabase/tap/supabase` |
| Vercel CLI | deploy แอป | `npm i -g vercel` |

> หมายเหตุ: `npm i -g supabase` ไม่ใช่ช่องทางที่ Supabase รองรับ — ใช้ Homebrew หรือ binary จาก [supabase.com/docs](https://supabase.com/docs/guides/cli)

---

## 🗄️ Part 1: Supabase

### 1.1 สร้าง project

1. ไปที่ [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. จด **Project Ref** ไว้ (URL ต่อท้าย: `https://<project-ref>.supabase.co`)

### 1.2 Link CLI

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 1.3 Push migrations

```bash
npm run deploy:supabase      # = supabase db push
```

ระบบมี 10 migration files — push ครั้งเดียวได้ทั้งชุด (เรียงตาม timestamp ในชื่อไฟล์):

| ไฟล์ | เพิ่มอะไร |
|------|----------|
| `20250618000000_initial_schema.sql` | `profiles`, `profile_roles`, enum `profile_role` |
| `20250618000001_security_policies.sql` | RLS + `is_admin()` / `is_moderator_or_admin()` + trigger สร้าง profile |
| `20250618000002_api_functions.sql` | CRUD บทบาทผู้ใช้ (`create_profile`, `set_profile_role`, …) |
| `20250618000003_storage.sql` | buckets `avatars` / `thumbnails` / `uploads` + 16 policies |
| `20250619000001_profile_functions.sql` | สลับ profile ที่ active, ดึง profile ทั้งหมด |
| `20250811000000_backend_user_functions.sql` | `get_paginated_users`, `get_auth_user_by_id` (admin only) |
| `20260108131500_racing_system.sql` | **ตารางหลักทั้งหมด**: `machines`, `customers`, `bookings`, `walk_in_queue`, `sessions` + enum 4 ตัว + RLS + trigger คำนวณราคา |
| `20260108131501_racing_system_rpc.sql` | RPC 27 ตัว (booking / queue / session / dashboard) + grants |
| `20260126000000_home_dashboard_stats.sql` | `rpc_get_home_dashboard_stats` |
| `20260417000000_create_or_update_customer_rpc.sql` | `create_or_update_customer` (ป้องกันแย่งเบอร์สมาชิก) |

### 1.4 ตรวจสอบผลลัพธ์

ไปที่ Supabase Dashboard → **Database → Tables** ต้องเห็น 7 ตาราง:

`profiles` · `profile_roles` · `machines` · `customers` · `bookings` · `walk_in_queue` · `sessions`

### 1.5 Seed (มีเงื่อนไข)

```bash
supabase db seed     # รัน supabase/seeds/*.sql
```

ไฟล์ seed สร้าง:
- auth users 3 คน (`admin@racing.com`, `user1@`, `user2@racinggamestation.com` — รหัสผ่าน `12345678`)
- profiles 4 อัน + role
- machines 6 เครื่อง

> ⚠️ **ห้าม seed บน production ที่มีข้อมูลจริงอยู่แล้ว** — จะได้ข้อมูลซ้ำ
>
> ⚠️ **ข้อจำกัดของ seed ปัจจุบัน**: profiles ทั้งหมดถูก insert ด้วย `is_active = FALSE` แต่โค้ด grant role ใช้เงื่อนไข `WHERE is_active = true` → **ไม่มีโปรไฟล์ไหนได้รับ role admin จริง** ต้อง login แล้วเรียก `set_profile_active` ก่อนถึงจะเข้า `/backend` ได้
>
> 🔎 อยากใช้ data ตัวอย่างเยอะกว่านี้ด้วย? `supabase/seeds_mock/000-init_seed.sql` — **ตอนนี้รันไม่ได้** เพราะอ้างตาราง `public.queues` และ type `public.queue_status` ที่ไม่มีอยู่จริง

### 1.6 ตั้งค่า Authentication

ไปที่ **Authentication → URL Configuration**:

| ช่อง | ค่า |
|------|-----|
| Site URL | `https://your-app.vercel.app` |
| Redirect URLs | เพิ่มทีละบรรทัด: |
| | `https://your-app.vercel.app/auth/callback` |
| | `https://your-app.vercel.app/auth/confirm` |
| | `http://localhost:3000/auth/callback` (สำหรับ dev) |

ไปที่ **Authentication → Providers → Email**:
- เปิด **Confirm email** (หรือปิดถ้าไม่อยากบังคับยืนยัน)
- ตั้ง **Email Templates** ให้เป็นภาษาไทยถ้าต้องการ

> ถ้าเปิด Confirm email แล้ว production ต้องต่อ SMTP — ค่า default ใช้ Inbucket ซึ่งรับได้แค่บน local

---

## ☁️ Part 2: Vercel

### 2.1 Import project

1. ไปที่ [vercel.com/new](https://vercel.com/new) → import repo
2. Framework preset: **Next.js** (ตรวจให้อัตโนมัติ)

### 2.2 Environment Variables

Project Settings → **Environment Variables** → เพิ่ม 2 ตัวนี้ (**Production + Preview + Development**):

| Variable | ค่า |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | จาก Dashboard → Project Settings → API → anon public key |

ตัวเหลือเป็น **optional** — ค่า default ใน `.env.example` ใช้ได้ทั้งหมด:

| Variable | ค่าเริ่มต้น | ผล |
|----------|-----------|-----|
| `NEXT_PUBLIC_AUTH_REGISTRATION_ENABLED` | `false` | ปิดการสมัครสมาชิก (แนะนำสำหรับ production) |
| `NEXT_PUBLIC_AUTH_EMAIL_VERIFICATION_ENABLED` | `true` | ต้องยืนยันอีเมล |
| `NEXT_PUBLIC_ENABLE_CHAT_WIDGET` | `false` | เปิด chat widget ในหน้า admin |
| `LINE_CHANNEL_ACCESS_TOKEN` | (ว่าง) | ต้องใส่ถ้าจะเปิด LINE OA |
| `LINE_CHANNEL_SECRET` | (ว่าง) | ใช้ verify webhook |

> **ไม่ต้องใส่ `SUPABASE_SERVICE_ROLE_KEY`** — โค้ดไม่ได้อ่านค่านี้ที่ไหนเลย ทุกอย่างรันด้วย anon key + RLS

> ⚠️ อย่าใส่เครื่องหมายคำพูดรอบค่าใน Vercel UI — พิมพ์ `Racing Game Station` ตรง ๆ ไม่ใช่ `"Racing Game Station"`

### 2.3 Deploy

```bash
npm run deploy:vercel          # production (./scripts/deploy-vercel.sh production)
npm run deploy:vercel:preview  # preview
```

สคริปต์จะรันเองให้ก่อน deploy:
1. `npm run type-check`
2. `npm run build`
3. `vercel --prod`

ถ้า build ผ่านแต่อยากทำเอง:
```bash
vercel link
vercel --prod
```

### 2.4 Build-time env ที่ระบบ inject ให้เอง

จาก [`next.config.ts`](../next.config.ts) — ไม่ต้องตั้งเอง:

| Variable | ที่มาจาก |
|----------|---------|
| `NEXT_PUBLIC_APP_VERSION` | `package.json` → `version` |
| `NEXT_PUBLIC_COMMIT_SHA` | `VERCEL_GIT_COMMIT_SHA` หรือ `git rev-parse HEAD` (แสดงใน footer) |

---

## 🔄 Full Deployment

```bash
npm run deploy:all
```

รัน 4 ขั้น ถามยืนยัน `(yes/no)` ทีละขั้น:

| # | ขั้น | ทำอะไร |
|---|------|--------|
| 1 | `setup-env.sh production` | ตรวจว่ามี 4 var จำเป็นครบ — ขาดตัวใดจะหยุดทั้งกระบวนการ |
| 2 | `deploy-supabase.sh push` | `supabase db push` |
| 3 | `deploy-supabase.sh generate` | gen types → `src/domain/types/supabase.ts` |
| 4 | `deploy-vercel.sh production` | type-check + build + deploy |

### ตรวจ env ก่อน deploy (ไม่ต้องรันขั้นอื่น)

```bash
NEXT_PUBLIC_SUPABASE_URL=... \
NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
SUPABASE_SERVICE_ROLE_KEY=... \
NEXT_PUBLIC_APP_URL=... \
npm run setup:env:prod
```

---

## 🔄 CI/CD

### Vercel auto-deploy

Vercel จะ deploy อัตโนมัติเมื่อ push:

| Branch | ผลลัพธ์ |
|--------|--------|
| `main` | Production |
| อื่นๆ (รวม `develop`) | Preview deployment |

> ⚠️ **Migration ไม่ได้ deploy อัตโนมัติ** — ถ้า push โค้ดที่ต้องการ migration ใหม่ แอปจะพังจนกว่าจะรัน `npm run deploy:supabase` เอง

### ลำดับที่แนะนำตอน deploy เอง

```
1. แก้ migration ใน supabase/migrations/
2. npm run deploy:supabase          # push DB ก่อน
3. npm run supabase-generate        # sync types ให้ตรง schema
4. npm run type-check && npm run lint
5. npm run deploy:vercel
```

---

## 🔧 Local Development

```bash
npm run setup:env        # copy .env.example → .env.local (ถ้ายังไม่มี)
npm run supabase-start   # ต้องเปิด Docker Desktop ก่อน
npm run supabase-reset   # ล้าง DB + รัน migrations + seed
npm run dev              # http://localhost:3000
```

### Ports ของ local Supabase

จาก [`supabase/config.toml`](../supabase/config.toml):

| Service | Port |
|---------|------|
| API (REST/GoTrue) | `54321` |
| DB | `54322` |
| Studio | `54323` |
| Inbucket (mail catcher) | `54324` |

ค่า `.env.local` ต้องตรงกับนี้:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### คำสั่งที่ใช้บ่อย

```bash
npm run supabase-stop       # ปิด local Supabase
npm run supabase-db-diff    # ตรวจว่า schema ที่รันไป drift จาก migration หรือไม่
npm run supabase-generate   # sync src/domain/types/supabase.ts
npm run type-check
npm run lint
```

---

## 🔒 Pre-Deploy Checklist

- [ ] `npm run type-check` ผ่าน
- [ ] `npm run lint` ผ่าน
- [ ] `npm run build` ผ่าน
- [ ] `supabase link` ชี้ไป project ที่ถูกต้อง (`supabase projects list` ตรวจ)
- [ ] ตารางทั้ง 7 มีใน Dashboard → Database → Tables
- [ ] Vercel env vars ครบ 2 ตัวแรก + เลือก environment ครบทุกเคส
- [ ] Authentication → Site URL + Redirect URLs ตรงกับโดเมนจริง
- [ ] เปิด/ปิด Confirm email ตามที่ต้องการ
- [ ] ถ้าเปิด chat: ใส่ `LINE_CHANNEL_*` + ชี้ webhook URL ที่ LINE Console ไปที่ `/api/chat/webhook`
- [ ] ทดสอบสมัครสมาชิก + ยืนยันอีเมลทำงาน
- [ ] ลองจอง 1 รายการ → เข้า `/backend` → เริ่ม session → จบ session → ตรวจว่ายอดเงินถูกต้อง
- [ ] ทดสอบ walk-in: เข้าคิว → ดูเลขคิว → เรียกคิว

---

## 📊 Post-Deploy Checklist

### แอปพื้นฐาน
- [ ] `/` โหลดได้ เห็นสรุปเครื่อง + สถิติวันนี้
- [ ] `/time-booking` เลือกเครื่อง + วัน + เวลาได้
- [ ] `/customer/booking-history` เห็นตารางจอง
- [ ] `/walk-in` เข้าคิวได้
- [ ] `/qr-scan` สร้าง QR ได้

### Auth
- [ ] Login ด้วย email/password
- [ ] ลืมรหัสผ่าน → รับ email → reset ได้
- [ ] `/backend` และ `/profile` redirect ไป `/auth/login` เมื่อยังไม่ login
- [ ] Admin login แล้วเข้า `/backend` ได้

### หลังล็อกอินเป็น admin
- [ ] แท็บเครื่อง: เปลี่ยนสถานะได้, อัปโหลดรูปได้
- [ ] แท็บคิว: เรียกคิว / ยกเลิกได้
- [ ] แท็บเซสชัน: เริ่ม (จากคิว / จาก booking / manual) → จบ → แก้ยอดเงิน → เปลี่ยนสถานะชำระเงิน
- [ ] `/backend/control` เปลี่ยนธีมได้, เริ่ม/จบเซสชันได้
- [ ] แท็บลูกค้า: ค้นหา / กรอง / เพิ่ม / แก้ / ลบ / toggle VIP

---

## 🐛 Troubleshooting

### `Error: Supabase URL or Key not configured`

Supabase client อ่าน env ไม่ได้ ตรวจ:
```bash
npm run setup:env        # local
npm run setup:env:prod   # production (ต้องส่ง 4 var เข้ามาด้วย)
```

### Migration ไม่ apply

```bash
supabase link --project-ref YOUR_PROJECT_REF   # ลอง link ใหม่
supabase db remote list                        # ดูว่าเห็น project ไหน
npm run deploy:supabase:status                 # ดู migration files + db diff
```

### `permission denied for schema public`

Service role key ไม่มีสิทธิ์พอ หรือ link ไป project ผิด — ตรวจ `supabase link` อีกครั้ง

### Login แล้วถูกเด้งออกทันที

- เช็คว่า Vercel มี env vars ครบทุก environment (Production vs Preview แยกกัน)
- ลองเพิ่ม `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` ให้ Preview ด้วย
- ล้าง cookie ของเว็บแล้วลองใหม่

### `/backend` redirect ไป login วนไป

Role ในฐานข้อมูลยังไม่ใช่ admin/moderator — ตรวจ:
```sql
SELECT p.username, p.is_active, r.role
FROM public.profiles p
LEFT JOIN public.profile_roles r ON r.profile_id = p.id
WHERE p.username = 'admin_personal';
```

ต้องได้ `role = 'admin'` **และ** `is_active = true` ถึงจะเข้าได้ (ดู Known Issues ใน [README](../README.md#-known-issues--สิ่งที่ยังต้องแก้) เรื่อง seed ไม่ grant role)

ถ้าข้อมูลถูกต้องแล้วแต่ยังเข้าไม่ได้ เรียก RPC เพื่อ activate:
```sql
SELECT public.set_profile_active('<profile-id>');
```

### `rpc_get_my_bookings` คืนข้อมูลลูกค้าคนอื่น

เป็นช่องโหว่ที่รู้อยู่แล้ว — RPC เป็น `SECURITY DEFINER` + grant ให้ `anon` แต่ไม่ตรวจ ownership ดูรายละเอียดใน [README → Security](../README.md#-security)

### LINE webhook ไม่ตอบ

- ตรวจว่า `LINE_CHANNEL_SECRET` ตรงกับใน LINE Developers Console
- LINE ต้องการ HTTP **200 เสมอ** — route นี้จึงตอบ 200 แม้ verify ไม่ผ่าน ดู log ใน Vercel เพื่อเช็คว่ามี `invalid signature`
- Chat route อื่น (`/api/chat/message` ฯลฯ) ต้อง login เป็น admin ด้วย

### Type error ตอน build

```bash
npm run supabase-generate   # schema เปลี่ยนแต่ types ยังไม่ sync
npm run type-check
```

---

## 📚 Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

---

<p align="center">
  <strong>🏎️ Racing Game Station — Deployment Guide</strong><br/>
  <sub>Built with ❤️ in Thailand</sub>
</p>
