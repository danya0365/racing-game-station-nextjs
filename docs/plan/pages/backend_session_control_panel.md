# Game Room Control Page Design - /backend/control

## Overview
สร้างหน้า **Full-Screen Focus Mode** สำหรับควบคุมห้องเกม ที่ redesign ใหม่ทั้งหมดโดยเน้นที่:
- **Session-Centric**: ใช้ Session เป็นศูนย์กลางในการ track การใช้งานเครื่อง
- **UX ที่ดี**: แสดงเฉพาะข้อมูลที่จำเป็น ปุ่มใหญ่ อ่านง่าย ใช้จอสัมผัสได้
- **Real-time**: อัพเดตข้อมูลอัตโนมัติ

---

## 🎮 UI Concept: Game Room Control Panel

จำลอง "Control Room" ที่พนักงานใช้ควบคุมห้องเกม โดยจะมี:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎮 Game Room Control             [เวลาปัจจุบัน]     [Walk-in Queue] [Refresh] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │  🖥️ STATION 1        │ │  🖥️ STATION 2        │ │  🖥️ STATION 3        │ │
│  │  ━━━━━━━━━━━━━━━━━━  │ │  ━━━━━━━━━━━━━━━━━━  │ │  ━━━━━━━━━━━━━━━━━━  │ │
│  │                      │ │                      │ │                      │ │
│  │  🟢 AVAILABLE        │ │  🔴 IN USE           │ │  🟡 RESERVED         │ │
│  │                      │ │  👤 สมชาย            │ │  👤 มานี            │ │
│  │                      │ │  ⏱️ 00:45:32          │ │  📅 จอง 14:00        │ │
│  │                      │ │                      │ │                      │ │
│  │  [▶️ Start Manual]    │ │  [⏹️ End Session]   │ │  [✅ Check-in]       │ │
│  │  [📋 From Queue]      │ │  [💳 Payment]        │ │  [❌ Cancel]         │ │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Features & Actions

### Station States (3 หลักๆ)

| State | Color | Description | Actions Available |
|-------|-------|-------------|-------------------|
| 🟢 **Available** | Green | เครื่องว่าง พร้อมใช้งาน | Start Manual, From Queue |
| 🔴 **In Use** | Orange/Red | กำลังมีคนเล่น (Active Session) | End Session, Update Payment |
| 🟡 **Reserved** | Yellow | มีการจองรอ Check-in | Check-in, Cancel Booking |

### Primary Actions

1. **▶️ Start Manual Session** (เครื่องว่าง)
   - สำหรับ Walk-in ที่ไม่ได้จองหรือไม่ได้ต่อคิว
   - กรอกชื่อลูกค้า → Start session ทันที

2. **📋 From Queue** (เครื่องว่าง)
   - เลือกจากคิว Walk-in ที่รออยู่
   - Seat → Auto start session

3. **✅ Check-in** (เครื่องจอง)
   - ลูกค้าที่จองมาถึงแล้ว
   - Start session จาก booking

4. **⏹️ End Session** (เครื่องกำลังใช้)
   - จบการเล่น
   - แสดง summary (duration, amount)

5. **💳 Update Payment** (เครื่องกำลังใช้)
   - Mark as Paid / Partial

---

## Proposed Changes

### [NEW] [page.tsx](file:///Users/marosdeeuma/racing-game-station-nextjs/app/backend/control/page.tsx)
Simple page wrapper, renders `<ControlView />`

---

### [NEW] [ControlView.tsx](file:///Users/marosdeeuma/racing-game-station-nextjs/src/presentation/components/backend/ControlView.tsx)

Main component features:
- Full-screen gradient background
- Header with current time, back button, refresh
- Grid of Station Cards
- Modals for actions (StartManual, FromQueue, EndSession)

```typescript
// Simplified structure
export function ControlView() {
  const { 
    machines,
    activeSessions,
    waitingQueue,
    reservedBookings,
    loading,
    // Actions
    startManualSession,
    startFromQueue,
    startFromBooking,
    endSession,
    refreshData
  } = useControlPresenter();

  return (
    <FullScreenLayout>
      <Header />
      <StationGrid>
        {machines.map(machine => (
          <StationCard 
            machine={machine}
            session={getActiveSession(machine.id)}
            booking={getReservedBooking(machine.id)}
          />
        ))}
      </StationGrid>
      {/* Modals */}
    </FullScreenLayout>
  );
}
```

---

### [NEW] [useControlPresenter.ts](file:///Users/marosdeeuma/racing-game-station-nextjs/src/presentation/presenters/backend/useControlPresenter.ts)

Custom hook following MVP pattern:
- Loads machines, sessions, walk-in queue, today's bookings
- Provides action handlers
- Auto-refresh with realtime support

```typescript
export function useControlPresenter() {
  // Repositories
  const sessionRepo = useMemo(() => createSessionRepository(), []);
  const machineRepo = useMemo(() => createMachineRepository(), []);
  const walkInRepo = useMemo(() => createWalkInQueueRepository(), []);
  const bookingRepo = useMemo(() => createBookingRepository(), []);

  // State
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [waitingQueue, setWaitingQueue] = useState<WalkInQueue[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  
  // Actions
  const startManualSession = async (machineId: string, customerName: string) => { ... };
  const startFromQueue = async (machineId: string, queueId: string) => { ... };
  const startFromBooking = async (machineId: string, bookingId: string) => { ... };
  const endSession = async (sessionId: string, totalAmount?: number) => { ... };
  
  return { ... };
}
```

---

## Key Design Decisions

### 1. **Session as Single Source of Truth**
- Active Session = เครื่องถูกใช้งาน
- ไม่สนใจ booking status โดยตรง เพราะ session จะ track จริงว่าเครื่องมีคนใช้หรือไม่

### 2. **Simplified State Machine**
```
Machine State Logic:
  if (hasActiveSession) → IN_USE (🔴)
  else if (hasReservedBooking) → RESERVED (🟡)
  else → AVAILABLE (🟢)
```

### 3. **Touch-Friendly UI**
- ปุ่มใหญ่พอสำหรับจอสัมผัส
- Minimal text, icon-heavy
- Color-coded for quick recognition

### 4. **Walk-in Queue Integration**
- แสดง queue count ที่ header
- Quick select จาก queue เมื่อจะ seat

---

## Verification Plan

### Manual Testing
1. ทดสอบ Start Manual Session → ดู session ถูกสร้าง
2. ทดสอบ Start From Queue → ดู queue status เปลี่ยน + session เริ่ม
3. ทดสอบ Check-in จาก Booking → ดู booking status + session
4. ทดสอบ End Session → ดู session จบ, machine กลับว่าง
5. Auto-refresh ทุก 30 วินาที

### Browser Testing
- เปิดหน้า `/backend/control`
- Verify UI responsive
- Test actions

---

## File Summary

| File | Action | Description |
|------|--------|-------------|
| `app/backend/control/page.tsx` | NEW | Page route |
| `src/presentation/components/backend/ControlView.tsx` | NEW | Main control view |
| `src/presentation/presenters/backend/useControlPresenter.ts` | NEW | Presenter hook |
