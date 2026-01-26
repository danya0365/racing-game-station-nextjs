# 🚀 Racing Game Station Deployment Guide

คู่มือการ Deploy ระบบ Racing Game Station ไปยัง Production

---

## 📋 Quick Reference

```bash
# ติดตั้ง CLI tools ที่จำเป็น
npm i -g vercel supabase

# Deploy full stack
npm run deploy:all

# Deploy เฉพาะส่วน
npm run deploy:vercel        # Deploy Next.js app
npm run deploy:supabase      # Deploy database migrations
```

---

## 📦 Prerequisites

### 1. Install CLI Tools

```bash
# Vercel CLI
npm i -g vercel

# Supabase CLI (macOS)
brew install supabase/tap/supabase

# หรือใช้ npm
npm i -g supabase
```

### 2. Login to Services

```bash
# Login to Vercel
vercel login

# Login to Supabase
supabase login
```

### 3. Create Projects

1. **Supabase**: ไปที่ [supabase.com/dashboard](https://supabase.com/dashboard) และสร้าง project ใหม่
2. **Vercel**: ไปที่ [vercel.com](https://vercel.com) และ import repository

---

## 🗄️ Supabase Setup

### Step 1: Link Project

```bash
# ดู project-ref จาก Supabase Dashboard > Project Settings
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 2: Deploy Migrations

```bash
# Push migrations ไปยัง remote
npm run deploy:supabase

# หรือใช้ supabase CLI โดยตรง
supabase db push
```

### Step 3: Verify Deployment

เข้าไปที่ Supabase Dashboard > Database > Tables เพื่อตรวจสอบว่า tables ถูกสร้างแล้ว:

- `machines` - เครื่องเล่น Racing Game Station
- `queues` - คิวการจอง
- `profiles` - ข้อมูลผู้ใช้

### Step 4: Seed Production Database (Optional)

> ⚠️ **คำเตือน**: การ seed database จะเพิ่มข้อมูลทดสอบเข้าไปใน production ควรทำเฉพาะเมื่อ:
> - Database ยังว่างเปล่า (deploy ครั้งแรก)
> - ต้องการข้อมูลตัวอย่างสำหรับทดสอบ
> - **อย่าทำถ้ามีข้อมูลจริงอยู่แล้ว** เพราะจะเกิดข้อมูลซ้ำซ้อน

#### วิธีที่ 1: ใช้ Supabase SQL Editor (แนะนำ)

1. ไปที่ Supabase Dashboard > SQL Editor
2. เปิดไฟล์ `supabase/seeds/000-init_seed.sql` ในเครื่องของคุณ
3. Copy เนื้อหาทั้งหมดแล้ว Paste ลงใน SQL Editor
4. กด **Run** เพื่อ execute

#### วิธีที่ 2: ใช้ psql CLI

```bash
# 1. ดู connection string จาก Supabase Dashboard > Project Settings > Database
# Format: postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres

# 2. Run seed file
psql "postgresql://postgres:[YOUR-PASSWORD]@[HOST]:[PORT]/postgres" \
  -f supabase/seeds/000-init_seed.sql
```

#### วิธีที่ 3: ใช้ Supabase CLI (ถ้า link project แล้ว)

```bash
# Link project ก่อน (ถ้ายังไม่ได้ทำ)
supabase link --project-ref YOUR_PROJECT_REF

# Run seed
supabase db seed
```

#### ข้อมูลที่จะถูก seed:

**Users & Authentication:**
- Admin: `admin@racing.com` (password: `12345678`)
- User 1: `user1@racinggamestation.com` (password: `12345678`)
- User 2: `user2@racinggamestation.com` (password: `12345678`)

**Machines:**
- 6 เครื่อง Racing Game Station (Game Station 1-6)

**Customers:**
- 10 ลูกค้าตัวอย่าง พร้อมประวัติการเล่น

**Historical Queues:**
- ข้อมูลคิวย้อนหลัง 30 วัน (5-15 bookings ต่อวัน)
- สถานะ: completed, cancelled, waiting, playing

> 💡 **หมายเหตุ**: หลังจาก seed แล้ว คุณควรเปลี่ยนรหัสผ่าน admin ทันที!

### Step 5: Configure Authentication

1. ไปที่ Supabase Dashboard > Authentication > Providers
2. Enable Email provider
3. ตั้งค่า Site URL: `https://your-app.vercel.app`
4. ตั้งค่า Redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/auth/confirm`

---

## ☁️ Vercel Setup

### Step 1: Import Project

```bash
# สร้าง project ใหม่ใน Vercel
vercel

# หรือ link กับ project ที่มีอยู่
vercel link
```

### Step 2: Configure Environment Variables

ใน Vercel Dashboard > Project Settings > Environment Variables เพิ่ม:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key | `eyJhbGci...` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | App display name | `Racing Game Station` |
| `NEXT_PUBLIC_AUTH_EMAIL_ENABLED` | Enable email auth | `true` |
| `NEXT_PUBLIC_AUTH_REGISTRATION_ENABLED` | Allow registration | `false` |

> ⚠️ **สำคัญ**: ค่าจาก Supabase หาได้ที่ Project Settings > API

### Step 3: Deploy

```bash
# Deploy to production
npm run deploy:vercel

# หรือ deploy preview
npm run deploy:vercel:preview
```

---

## 🔄 CI/CD Workflow

### Recommended Workflow

```
1. Development (local)
   ↓
2. Test build locally
   npm run build
   ↓
3. Deploy database changes
   npm run deploy:supabase
   ↓
4. Deploy to Vercel
   npm run deploy:vercel
```

### Automatic Deployment

Vercel จะ auto-deploy เมื่อ:
- **Push to main/master**: Deploy to production
- **Push to other branches**: Deploy preview

---

## 🔧 Environment Configuration

### Local Development (.env.local)

```bash
# Supabase Configuration (Local)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Racing Game Station"

# Auth Configuration
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NEXT_PUBLIC_AUTH_REGISTRATION_ENABLED=true
```

### Production (Vercel Environment Variables)

```bash
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME="Racing Game Station"

# Auth Configuration - Production มักจะปิดการ register
NEXT_PUBLIC_AUTH_EMAIL_ENABLED=true
NEXT_PUBLIC_AUTH_REGISTRATION_ENABLED=false
```

---

## 🔒 Security Checklist

ก่อน deploy ตรวจสอบว่า:

- [ ] **RLS Enabled**: Row Level Security เปิดใน Supabase
- [ ] **Service Role Key**: ไม่ expose ใน client-side code
- [ ] **Redirect URLs**: ตั้งค่าใน Supabase Auth
- [ ] **CORS**: ตั้งค่า allowed origins ใน Supabase
- [ ] **Email Templates**: ตั้งค่า email templates ใน Supabase

---

## 📊 Post-Deployment Checklist

### 1. Verify Application

- [ ] Home page loads correctly
- [ ] Customer booking works
- [ ] Admin dashboard accessible
- [ ] Queue management functional

### 2. Verify Authentication

- [ ] Login works
- [ ] If registration enabled, test registration
- [ ] Forgot password flow works
- [ ] Protected routes redirect correctly

### 3. Verify Database

- [ ] Machines show correctly
- [ ] Queue creation works
- [ ] Status updates work
- [ ] Real-time updates work

---

## 🐛 Troubleshooting

### Supabase Connection Error

```
Error: Supabase URL or Key not configured
```

**Solution**: ตรวจสอบว่า environment variables ถูกตั้งค่าแล้วใน Vercel

### Authentication Error

```
Error: Invalid claim: missing sub claim
```

**Solution**: ตรวจสอบ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ว่าถูกต้อง

### Build Error

```
Error: Type error during build
```

**Solution**: รัน `npm run type-check` และแก้ไข TypeScript errors

### Migration Error

```
Error: permission denied for schema public
```

**Solution**: ตรวจสอบว่า service role key มีสิทธิ์เพียงพอ

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

## 📞 Support

หากพบปัญหาในการ deploy สามารถ:

1. ตรวจสอบ [GitHub Issues](https://github.com/yourusername/racing-game-station-nextjs/issues)
2. อ่าน [Troubleshooting Guide](#troubleshooting)
3. Contact: your-email@example.com

---

<p align="center">
  <strong>🏎️ Racing Game Station - Deployment Guide</strong><br/>
  <sub>Built with ❤️ for Racing Game Station enthusiasts</sub>
</p>
