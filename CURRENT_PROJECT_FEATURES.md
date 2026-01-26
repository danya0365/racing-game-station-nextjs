# 🏎️ Racing Game Station - Current Project Features

> **สรุปฟีเจอร์ปัจจุบัน** | Last Updated: 2026-01-12

---

## 📋 สารบัญ

- [ภาพรวมระบบ](#-ภาพรวมระบบ)
- [หน้าเว็บ (App Routes)](#-หน้าเว็บ-app-routes)
- [ระบบฐานข้อมูล (Database)](#-ระบบฐานข้อมูล-database)
- [ฟังก์ชัน RPC (Remote Procedure Calls)](#-ฟังก์ชัน-rpc-remote-procedure-calls)
- [ระบบความปลอดภัย (Security)](#-ระบบความปลอดภัย-security)
- [ระบบจัดเก็บไฟล์ (Storage)](#-ระบบจัดเก็บไฟล์-storage)

---

## 🎯 ภาพรวมระบบ

**Racing Game Station** เป็นระบบจัดการคิวสำหรับ Racing Game Station ที่พัฒนาด้วย **Next.js** และ **Supabase** ตามแนวทาง **Clean Architecture**

### เทคโนโลยีหลัก
- **Frontend**: Next.js 14+ (App Router)
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Architecture**: Clean Architecture + Presenter Pattern

---

## 🌐 หน้าเว็บ (App Routes)

### 🏠 หน้าหลัก
| Route | หน้า | รายละเอียด |
|-------|------|------------|
| `/` | Home | หน้าแรกของระบบ - แสดงภาพรวมร้านและเครื่องเล่น |

### 👤 ระบบลูกค้า (Customer)
| Route | หน้า | รายละเอียด |
|-------|------|------------|
| `/customer` | Customer Dashboard | หน้าหลักสำหรับลูกค้า |
| `/customer/booking` | Booking | หน้าจองคิวเครื่องเล่น |
| `/customer/queue/[id]` | Queue Detail | หน้าดูรายละเอียดคิวแต่ละรายการ |
| `/customer/queue-status` | My Queue Status | หน้าดูสถานะคิวของตัวเอง |
| `/customer/queue-history` | Queue History | หน้าดูประวัติการจองคิว |

### 💼 ระบบแอดมิน (Backend)
| Route | หน้า | รายละเอียด |
|-------|------|------------|
| `/backend` | Admin Dashboard | หน้าหลักสำหรับแอดมิน |
| `/backend/control` | Gaming Room Control | หน้าควบคุมห้องเกม/เครื่องเล่น |

### 👤 ระบบโปรไฟล์ (Profile)
| Route | หน้า | รายละเอียด |
|-------|------|------------|
| `/profile` | Profile | หน้าจัดการโปรไฟล์ผู้ใช้ |

### 🔐 ระบบ Authentication
| Route | หน้า | รายละเอียด |
|-------|------|------------|
| `/auth/login` | Login | หน้าเข้าสู่ระบบ |
| `/auth/register` | Register | หน้าลงทะเบียน |
| `/auth/callback` | Auth Callback | Callback สำหรับ OAuth |
| `/auth/confirm` | Confirm Email | หน้ายืนยันอีเมล |
| `/auth/forgot-password` | Forgot Password | หน้าลืมรหัสผ่าน |
| `/auth/reset-password` | Reset Password | หน้ารีเซ็ตรหัสผ่าน |
| `/auth/verify-email` | Verify Email | หน้ายืนยันอีเมล |

### 📱 ฟีเจอร์พิเศษ
| Route | หน้า | รายละเอียด |
|-------|------|------------|
| `/qr-scan` | QR Scan | หน้าสแกน QR Code เพื่อจองคิว |
| `/quick-booking` | Quick Booking | หน้าจองคิวแบบด่วน |

---

## 💾 ระบบฐานข้อมูล (Database)

### ตารางหลัก

#### 1. `profiles` - โปรไฟล์ผู้ใช้
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `auth_id` | UUID | FK → auth.users |
| `username` | TEXT | ชื่อผู้ใช้ (unique) |
| `full_name` | TEXT | ชื่อเต็ม |
| `phone` | TEXT | เบอร์โทรศัพท์ |
| `avatar_url` | TEXT | URL รูปโปรไฟล์ |
| `date_of_birth` | DATE | วันเกิด |
| `gender` | TEXT | เพศ (male/female/other) |
| `address` | TEXT | ที่อยู่ |
| `bio` | TEXT | ประวัติส่วนตัว |
| `preferences` | JSONB | การตั้งค่า (ภาษา, แจ้งเตือน, theme) |
| `social_links` | JSONB | ลิงก์โซเชียล |
| `verification_status` | TEXT | สถานะยืนยัน (pending/verified/rejected) |
| `privacy_settings` | JSONB | การตั้งค่าความเป็นส่วนตัว |
| `last_login` | TIMESTAMPTZ | เวลาเข้าสู่ระบบล่าสุด |
| `login_count` | INTEGER | จำนวนครั้งที่เข้าสู่ระบบ |
| `is_active` | BOOLEAN | สถานะใช้งาน |

#### 2. `profile_roles` - บทบาทผู้ใช้
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `profile_id` | UUID | FK → profiles |
| `role` | ENUM | บทบาท (user/moderator/admin) |
| `granted_by` | UUID | FK → auth.users |
| `granted_at` | TIMESTAMPTZ | เวลาที่ได้รับบทบาท |

#### 3. `machines` - เครื่องเล่น Racing Game Station
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `name` | TEXT | ชื่อเครื่อง |
| `description` | TEXT | รายละเอียด |
| `position` | INTEGER | ตำแหน่งจัดเรียง |
| `image_url` | TEXT | URL รูปเครื่อง |
| `is_active` | BOOLEAN | เปิด/ปิดใช้งาน |
| `status` | ENUM | สถานะ (available/occupied/maintenance) |
| `current_queue_id` | UUID | FK → queues (คิวที่กำลังเล่น) |

#### 4. `customers` - ลูกค้า
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `profile_id` | UUID | FK → profiles (nullable สำหรับ guest) |
| `name` | TEXT | ชื่อลูกค้า |
| `phone` | TEXT | เบอร์โทรศัพท์ |
| `email` | TEXT | อีเมล |
| `visit_count` | INTEGER | จำนวนครั้งที่มาเล่น |
| `total_play_time` | INTEGER | เวลาเล่นรวม (นาที) |
| `last_visit` | TIMESTAMPTZ | เวลามาเล่นล่าสุด |
| `notes` | TEXT | หมายเหตุ |
| `is_vip` | BOOLEAN | สถานะ VIP |

#### 5. `queues` - คิวจอง
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary Key |
| `machine_id` | UUID | FK → machines |
| `customer_id` | UUID | FK → customers |
| `booking_time` | TIMESTAMPTZ | เวลาจอง |
| `duration` | INTEGER | ระยะเวลาเล่น (นาที) |
| `status` | ENUM | สถานะ (waiting/playing/completed/cancelled) |
| `position` | INTEGER | ลำดับคิว |
| `notes` | TEXT | หมายเหตุ |

### Custom Types (ENUM)
```sql
profile_role: user | moderator | admin
machine_status: available | occupied | maintenance
queue_status: waiting | playing | completed | cancelled
```

---

## 🔧 ฟังก์ชัน RPC (Remote Procedure Calls)

### 📱 สำหรับ Guest/Customer

| Function | Description |
|----------|-------------|
| `rpc_get_active_machines()` | ดึงรายการเครื่องเล่นที่เปิดใช้งาน |
| `rpc_get_today_queues()` | ดึงคิววันนี้ (ข้อมูลถูก mask) |
| `rpc_create_booking(...)` | สร้างการจองคิวใหม่ |
| `rpc_get_queue_details(p_queue_id)` | ดูรายละเอียดคิว |
| `rpc_cancel_queue_guest(p_queue_id, p_customer_id)` | ยกเลิกคิว (ตรวจสอบ ownership) |
| `rpc_get_my_queue_status(p_queue_ids)` | ดูสถานะคิวหลายรายการพร้อมกัน (พร้อมคำนวณเวลารอ) |
| `rpc_search_queues_by_phone(p_phone, p_local_customer_id)` | ค้นหาคิวด้วยเบอร์โทร (มี security check) |
| `rpc_get_machine_dashboard_info()` | ดูข้อมูล dashboard เครื่องเล่น (จำนวนรอ, เวลารอ) |

### 🔐 สำหรับ Admin/Moderator

| Function | Description |
|----------|-------------|
| `rpc_get_all_customers_admin()` | ดึงข้อมูลลูกค้าทั้งหมด (ไม่ mask) |
| `rpc_update_queue_status_admin(p_queue_id, p_status)` | อัปเดตสถานะคิว + อัปเดตเครื่อง + นับ visit_count |
| `rpc_reset_machine_queue(p_machine_id)` | รีเซ็ตคิวของเครื่อง (ยกเลิก waiting, complete playing) |
| `rpc_get_active_and_recent_queues()` | ดึงคิวที่ active และ 24 ชม.ล่าสุด |
| `rpc_get_backend_dashboard_stats()` | ดึงสถิติ dashboard (จำนวนเครื่อง, คิว, สถานะต่างๆ) |

### 👤 สำหรับจัดการ Profile

| Function | Description |
|----------|-------------|
| `get_active_profile()` | ดึง profile ที่ active ของ user ปัจจุบัน |
| `get_user_profiles()` | ดึง profile ทั้งหมดของ user |
| `set_profile_active(profile_id)` | ตั้ง profile ให้ active |
| `get_profile_role(profile_id)` | ดึง role ของ profile |
| `get_active_profile_role()` | ดึง role ของ profile ที่ active |
| `set_profile_role(target_profile_id, new_role)` | ตั้ง role (admin only) |

### 👮 สำหรับ Admin User Management

| Function | Description |
|----------|-------------|
| `get_paginated_users(p_page, p_limit)` | ดึงรายการ users แบบ pagination |
| `get_auth_user_by_id(p_id)` | ดึงข้อมูล user ตาม ID |

---

## 🔒 ระบบความปลอดภัย (Security)

### Row Level Security (RLS) Policies

#### Profiles
- ✅ **SELECT**: ทุกคนดูได้ (public profiles)
- ✅ **INSERT**: เฉพาะ authenticated users สร้างได้ (สำหรับตัวเอง)
- ✅ **UPDATE**: เฉพาะเจ้าของ profile แก้ไขได้

#### Machines
- ✅ **SELECT**: ทุกคนดูได้
- ✅ **ALL (INSERT/UPDATE/DELETE)**: เฉพาะ moderator/admin

#### Customers
- ✅ **SELECT**: moderator/admin หรือเจ้าของ profile
- ✅ **INSERT**: ทุกคนสร้างได้ (รองรับ guest booking)
- ✅ **UPDATE**: moderator/admin หรือเจ้าของ profile
- ✅ **DELETE**: เฉพาะ moderator/admin

#### Queues
- ✅ **SELECT**: ทุกคนดูได้
- ✅ **INSERT**: ทุกคนสร้างได้ (customer booking)
- ✅ **UPDATE**: เฉพาะ moderator/admin

### Helper Functions
- `is_admin()` - ตรวจสอบว่าเป็น admin หรือไม่
- `is_moderator_or_admin()` - ตรวจสอบว่าเป็น moderator หรือ admin
- `get_active_profile_id()` - ดึง profile ID ที่ active ของ user ปัจจุบัน
- `mask_phone(p_phone)` - ซ่อนเบอร์โทรศัพท์ (เช่น 081-XXX-5678)

### Auto-trigger Functions
- `handle_new_user()` - สร้าง profile อัตโนมัติเมื่อมี user ใหม่
- `create_default_role_for_profile()` - สร้าง role 'user' อัตโนมัติ
- `update_updated_at_column()` - อัปเดต timestamp อัตโนมัติ

---

## 📦 ระบบจัดเก็บไฟล์ (Storage)

### Buckets

| Bucket | Visibility | Description |
|--------|------------|-------------|
| `avatars` | Public | เก็บรูป avatar ของ users |
| `thumbnails` | Public | เก็บรูป thumbnails |
| `uploads` | Private | เก็บไฟล์ส่วนตัว |

### Storage Policies

#### Public Buckets (avatars, thumbnails)
- ✅ ทุกคนดูได้
- ✅ Users upload/update/delete ได้เฉพาะไฟล์ของตัวเอง (folder = auth.uid())

#### Private Bucket (uploads)
- ✅ เฉพาะเจ้าของดู/upload/update/delete ได้
- ✅ Admin CRUD ได้ทุกไฟล์

### Helper Function
- `get_private_url(bucket, object_path, expires_in)` - สร้าง signed URL สำหรับไฟล์ private

---

## 🏗️ สถาปัตยกรรม (Architecture Notes)

### Clean Architecture Pattern
- **Presentation Layer**: Views, Presenters, ViewModels
- **Domain Layer**: Use Cases, Entities, Repository Interfaces
- **Data Layer**: Repository Implementations, Data Sources

### Feature Highlights
1. **Server-Side Rendering (SSR)** - สำหรับ SEO optimization
2. **Presenter Pattern** - แยก business logic ออกจาก UI
3. **Factory Pattern** - สำหรับสร้าง Presenters
4. **RPC Functions** - ใช้ Supabase RPC แทน direct queries เพื่อ:
   - ลด N+1 queries
   - จัดการ permissions ที่ server
   - คำนวณ complex data (เช่น estimated wait time)
5. **Guest Booking Support** - รองรับการจองโดยไม่ต้อง login
6. **Phone Number Masking** - ปกป้องข้อมูลส่วนบุคคล

---

## 📈 Performance Optimizations

1. **Database Indexes** - สร้าง index บน columns ที่ใช้บ่อย:
   - `idx_machines_status`
   - `idx_customers_phone`
   - `idx_queues_machine_id`
   - `idx_queues_status`
   - `idx_queues_booking_time`

2. **Server-side Calculations** - ย้าย logic ไป database:
   - `rpc_get_my_queue_status` - คำนวณ queue ahead และ wait time
   - `rpc_get_machine_dashboard_info` - aggregate data
   - `rpc_get_backend_dashboard_stats` - dashboard statistics

3. **24-hour Operation Support** - ใช้ `NOW() - INTERVAL '24 hours'` แทน `CURRENT_DATE`

---

> 📝 **Note**: เอกสารนี้สร้างจากการวิเคราะห์ `/app` routes และ `/supabase/migrations` files
