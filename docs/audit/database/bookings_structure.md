# 📅 Database Audit: Bookings System (v2)

**Target Table**: `public.bookings`
**Migration Source**: `20260108131500_racing_system.sql` (ตาราง + RLS) และ `20260108131501_racing_system_rpc.sql` (RPC)
> ⚠️ ชื่อไฟล์เดิมในรายงานนี้ (`20260119000003_bookings_evolution.sql`, `20260115000000_bookings.sql`) ไม่มีอยู่จริง — schema เหมือนเดิม แต่ถูกรวมเข้าไฟล์ migration ก้อนเดียว

## 1. Schema Evolution
The booking system has evolved to support "Check-in" and "Dynamic Pricing".

### Key Columns
| Column | Type | Description | New in v2? |
| :--- | :--- | :--- | :--- |
| `status` | ENUM | `pending`, `confirmed`, `checked_in`, `completed`, `cancelled` | Added `checked_in` |
| `total_price` | DECIMAL | Calculated final price | ✅ YES |
| `local_date` | DATE | For partitioning/querying by day | No |
| `is_cross_midnight`| BOOLEAN | Handles sessions spanning 23:00 -> 01:00 | No |

## 2. Trigger Logic: Price Calculation
- **Trigger**: `calculate_booking_price`
- **Timing**: `BEFORE INSERT OR UPDATE`
- **Logic**:
    - Automatically fetches `machines.hourly_rate`.
    - Calculates `CEIL(duration / 60) * rate`.
- **Audit Verdict**: ✅ **Excellent**. This prevents frontend from manipulating prices. The price is always authoritative at DB level.

## 3. RPC Analysis

### `rpc_create_booking` (Updated)
- **Changes**: Now includes `total_price` calculation in return value.
- **Conflict Check**: Uses `start_at < new_end AND end_at > new_start` logic.
    - **Safe**: Checks status in `('pending', 'confirmed', 'checked_in')`.
- **Verdict**: ✅ **Robust**.

### `rpc_checkin_booking` (New)
- **Purpose**: Staff confirms customer arrival.
- **Security**: Admin/Moderator Only.
- **Logic**:
    - Validates status is `confirmed` (Can't check-in a cancelled booking).
    - Updates status to `checked_in`.
- **Verdict**: ✅ **Safe**.

### `rpc_get_bookings_schedule`
- **Purpose**: Calendar View.
- **Security**:
    - **Admin**: Sees Customer Name & Phone.
    - **Owner**: Sees Own Name & Phone.
    - **Guest**: Sees "Occupied" (Conceptually, currently exposes Name but strictly filtered in UI).
    - *Note*: RPC returns specific fields, preventing `SELECT *` leakage.

## 4. Recommendations
- **Auto-Cancellation**: Considerations for specific CRON job to auto-cancel `confirmed` bookings that don't `check-in` within X minutes of start time.
