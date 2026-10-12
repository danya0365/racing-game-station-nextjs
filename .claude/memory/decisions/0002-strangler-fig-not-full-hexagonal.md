---
name: 0002-strangler-fig-not-full-hexagonal
description: ตัดสินใจไม่ย้าย architecture เป็น hexagonal เต็มรูปแบบ ใช้ Strangler Fig + กฎมี teeth แทน — อ่านเมื่อมีคนขอ refactor architecture หรือแตะส่วนไหน
metadata:
  type: decision
  status: active
  scope: global
  updated: 2026-10-08
---

# ADR-0002: ใช้ Strangler Fig ไม่ใช่ย้ายเป็น Hexagonal เต็มรูปแบบ

**ตัดสินใจ:** 2026-10-08

## บริบท

งานนี้ขึ้น production แล้วหลายเดือนที่ <https://racing-game-station.vercel.app/> มีผู้ใช้จริง
เดิมสถาปัตยกรรมเป็น **over-engineered** — โปรเจคนี้เขียนแบบ Clean Architecture + Presenter Pattern แบบเต็มที่มี factory ทุกตัว

วิเคราะห์แล้วพบ:

| ตัวชี้วัด                             | ค่า                                                     |
| ------------------------------------- | ------------------------------------------------------- |
| โค้ดรวม                               | 31,182 บรรทัด                                           |
| Presenter files                       | 32 ไฟล์ / 9 feature (4–7 ไฟล์ต่อ feature)               |
| Repository interface : implementation | 9 : 19                                                  |
| Dead code                             | 7 ไฟล์ ~1,175 บรรทัด (grep = 0 import)                  |
| Dependency ที่ไม่ได้ใช้               | 10 ตัว                                                  |
| unit test                             | **0 ไฟล์**                                              |
| CI (`.github/`)                       | **ไม่มี**                                               |
| main vs develop                       | เนื้อหาเหมือนกัน (ต่างแค่ merge commit) → rollback ง่าย |

## การวิเคราะห์

**สถาปัตยกรรมปัจจุบันคือ ports & adapters อยู่แล้ว** — ตรวจแล้ว presenter class ไม่ import
`src/infrastructure` เลย **0 จุด** ส่วน 14 factory ที่ import คือ composition root ซึ่งถูกต้องตามหลัก hexagonal

ปัญหาจริงไม่ใช่ "ชื่อ layer ผิด" แต่คือ **"ไฟล์เยอะกว่าที่จำเป็น"** — สร้าง abstraction ไว้ "เผื่ออนาคต"
(Mock repository, ServerFactory ที่ไม่มีใครเรียก) แล้วไม่เคยใช้

ถ้าย้ายเป็น hexagonal เต็มรูปแบบ **dead code จะถูกลากไปด้วย** เพราะมันอยู่นอก scope ของการเปลี่ยนโครงสร้าง
และจะเพิ่มของ over-engineered ใหม่อีก ทั้งย้าย 31k บรรทัดโดยไม่มี test กับ CI = เสี่ยงเกินไป

## การตัดสินใจ

ใช้ **Strangler Fig**: ไม่ย้ายโค้ดเดิม แต่ค่อยๆ เปลี่ยนทีละส่วนที่ต้องแตะ

## กฎที่ต้องยึด

1. **ฟีเจอร์ใหม่** → เขียนผ่าน presenter (ทิศถูก) เท่านั้น
2. **แตะส่วนไหน** → refactor แค่ส่วนนั้น ตอนนั้น
3. **ส่วนที่ไม่เกี่ยวกับงาน** → **ห้ามแตะเด็ดขาด**

เหตุผล: ผู้ใช้กังวลเรื่องผลกระทบผู้ใช้จริงมากกว่าความสวยงามของสถาปัตยกรรม — ต้องเสนอทางที่กระทบต่ำสุดเสมอ

## เฟสที่วางไว้

### เฟส 1 — กฎมี teeth

เพิ่ม `dependency-cruiser` บังคับทิศที่มีอยู่แล้ว + CI

| กฎ                                                     | ผลตอนนี้                   |
| ------------------------------------------------------ | -------------------------- |
| `presentation/components` ห้าม import `infrastructure` | ❌ fail จับได้ 3 component |
| `domain` ห้าม import อะไรนอก `domain`                  | ✅ ผ่าน                    |
| ไม่มี circular                                         | ✅ ผ่าน                    |

⚠️ ต้องทำ baseline allowlist ก่อน ไม่งั้น CI เขียวไม่ได้
เพิ่มสคริปต์ `npm run check:arch` + `.github/workflows/ci.yml`

**ผลกระทบผู้ใช้:** ไม่มี · **ย้อนกลับได้:** ลบไฟล์

### เฟส 2 — ปิดช่องโหว่ที่ค้นพบ

| #   | ปัญหา                                                                | ที่แก้                                |
| --- | -------------------------------------------------------------------- | ------------------------------------- |
| 1   | `rpc_get_my_bookings` / `rpc_get_my_walk_in_queue` ไม่ตรวจ ownership | migration ใหม่                        |
| 2   | payment allowlist ยอมรับ `refunded` ที่ไม่มีใน enum                  | แก้ allowlist                         |
| 3   | error ของ Postgres หลุดถึง client                                    | ครอบ error เป็นข้อความกลาง            |
| 4   | `get_private_url()` เรียก `storage.sign_url()` ที่ไม่มี              | แก้เป็น `storage.create_signed_url()` |

**ผลกระทบผู้ใช้:** มี → ทดสอบ preview ก่อนเสมอ

### เฟส 3 — ลบ dead code (คุ้มที่สุด)

| ไฟล์                               | บรรทัด | หลักฐาน            |
| ---------------------------------- | ------ | ------------------ |
| `MockCustomerRepository.ts`        | ~200   | grep = 0 import    |
| `MockMachineRepository.ts`         | ~150   | grep = 0 import    |
| `AuthPresenterServerFactory.ts`    | ~25    | grep = 0 call site |
| `BookingPresenterServerFactory.ts` | ~30    | grep = 0 call site |
| `AuthProvider.tsx` (+hook 5 ตัว)   | ~120   | grep = 0 import    |
| `BookingView.tsx`                  | ~250   | grep = 0 import    |
| `QueueDetailModal.tsx`             | ~200   | grep = 0 import    |

**ผล:** −1,175 บรรทัด · ถอด Mock ออก → `RepositoryFactory` เหลือแค่ `Api*` → ชื่อ "Factory" ที่หลอกตาเลิก
**ผลกระทบผู้ใช้:** ไม่มี · **ย้อนกลับได้:** `git revert`

> `AuthPresenterServerFactory` / `BookingPresenterServerFactory` อาจตั้งใจ "เตรียมไว้" — ถ้าอยากเก็บ ให้ย้ายไป `docs/` แทนลบ

### เฟส 4 — ถอด dependency ที่ไม่ได้ใช้

`axios` · `zod` · `html2canvas` · `prismjs` · `@types/prismjs` · `react-hook-form` ·
`@uidotdev/usehooks` · `clsx` · `localforage` · `react-spring`

**ผลกระทบผู้ใช้:** น้อย · **ย้อนกลับได้:** ติดตั้งคืน

> `zod` อาจจำเป็นถ้าจะเพิ่ม validation — ตอนนี้ยังไม่ได้ใช้ ถ้าวางแผนจะเพิ่มก็เก็บไว้

### เฟส 5 — แก้ 3 component ที่ผิดทิศ

**จุดที่ค้นพบว่าง่ายกว่าที่คิด:** ทั้ง 3 ตัวเป็น feature `booking` และ `BookingPresenter` **มีอยู่แล้ว** พร้อม `useBookingPresenter` — แค่ไม่ถูกเรียก

| Component            | ยิงอะไรอยู่                                              | ทำอะไร                      |
| -------------------- | -------------------------------------------------------- | --------------------------- |
| `BookingStatusView`  | `getMyBookings` `cancel`                                 | ย้ายเข้า `BookingPresenter` |
| `BookingsTab`        | `getDaySchedule` `getByMachineAndDate` `update` `cancel` | ย้ายเข้า `BookingPresenter` |
| `BookingHistoryView` | `getAll` `getDaySchedule` `getByMachineAndDate`          | ย้ายเข้า `BookingPresenter` |

พร้อมกันนี้ลบ `BookingView.tsx` (dead code ที่คู่กัน) ได้เลย

**ผล:** ทิศถูกทั้งหมด + dep-cruiser เปิด ได้โดยไม่ต้องย้ายโค้ดที่ใช้งานจริง
**ผลกระทบผู้ใช้:** มี → ทดสอบ preview ก่อน

## สิ่งที่จะไม่ทำ

- ❌ ไม่ย้ายโค้ดเดิมเข้า `src/{domain,data,presentation}`
- ❌ ไม่เปลี่ยนชื่อ layer
- ❌ ไม่แตะส่วนที่ไม่เกี่ยวกับงาน
- ❌ ไม่แตะ `ControlView.tsx` (1,264 บรรทัด) — ใหญ่แต่ใช้งานได้ ไม่คุ้มเสี่ยง

## ข้อควรรู้

ทุกเฟสต้องเป็น **PR แยก เข้า `develop`** → merge เข้า `main` → Vercel auto-deploy
ตอนนี้ `main` กับ `develop` เนื้อหาเหมือนกัน → rollback ได้ง่าย

ดู [[git-workflow-branch-only]] · [[known-issues-backlog]] · [[project-racing-game-station]]
