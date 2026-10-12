---
paths:
  - "src/**"
  - "apps/**"
  - "packages/**"
  - "services/**"
---

# Definition of Done — เช็คก่อนบอกว่า "เสร็จ" (ทุก session / ทุก AI / พกข้ามโปรเจคได้)

> **กฎข้อเดียวที่สำคัญสุด:** ห้ามบอกที่รักว่างาน "เสร็จ" จนกว่าจะผ่าน checklist นี้ครบ —
> ไม่ว่าจะ session ไหน, AI ตัวไหน, มี persona ซาน่า หรือไม่. นี่คือมาตรฐานตายตัว ไม่ใช่ทางเลือก.

## ✅ Checklist ก่อนปิดงาน (เรียงตามลำดับ)

### 1. Gate เขียวครบ — **บังคับเสมอ**

```bash
npm run type-check
npm run lint
npm run build
npm test
```

**ต้องเขียวทุกตัว** · ถ้าแตะ data flow → `npm run test:api` ด้วย (ต้องเปิด dev server ก่อน)

> ⚠️ **`npm run lint` ยังแดงอยู่ 103 errors ทั้งหมดเป็นของเก่า** — ตอนเพิ่มโค้ดใหม่ต้อง
> เทียบกับ HEAD ก่อนว่าไม่มี error ใหม่หลุดเข้ามา ไม่ใช่ดูแค่ตัวเลขรวม
> (`git worktree add /tmp/<ชื่อ> HEAD --detach` แล้วรัน eslint ทั้งสองฝั่งแล้ว diff)
>
> **ยังไม่มี CI** — gate ทุกตัวรันมือ การยึดกฎนี้อาศัยวินัย
> (เฟส 1 ของ [[0002-strangler-fig-not-full-hexagonal]] จะเพิ่ม dep-cruiser + CI)

> ✅ **`npm test` มีแล้ว** (เพิ่ม 2026-10-12) — รันด้วย `node --test` ตรง ไม่ต้องลง
> test runner ใหม่ ใช้ loader ที่ [`scripts/test/loader.mjs`](../../scripts/test/loader.mjs)
> จัดการ `@/` alias + extensionless import · ครอบ **ฝั่งราคาเท่านั้น** ที่เหลือยังไม่มี
> · เทสฝั่ง DB (`pricing-sync`) ข้ามถ้า local Supabase ไม่ได้ขึ้น — ข้าม ≠ ผ่าน

### 2. Test ครอบของใหม่ — **บังคับเมื่อเพิ่ม/แก้ logic**

- domain/logic กลาง = test ครอบทุก branch ใหม่
- adapter = contract test (mock + payload จาก docs จริง)
- ทุก behavior ใหม่ต้องมี test ยืนยัน — ไม่ใช่แค่ "คอมไพล์ผ่าน"

### 3. Verify บน real-flow — **บังคับเมื่อแตะ flow ที่ผู้ใช้เห็น / DB**

ถ้างานแตะ flow ที่ผู้ใช้เห็น หรือเขียน/อ่าน DB จริง:

- รัน/ยิงจริงให้เห็นว่า flow ทำงาน (พิสูจน์บนจอ + ใน DB จริง)
- ⚠️ **stack ไม่ up (ไม่มี dev server / sandbox)** → **ห้ามเคลมว่า "เสร็จ/พิสูจน์แล้ว"** ·
  ต้องแจ้งที่รักตรงๆ ว่า "โค้ดเขียวแต่ยังไม่ได้ verify บนจริงเพราะ stack ไม่ up" + บอกวิธีรัน

> งานที่ไม่แตะ flow จริง (refactor logic ล้วน, แก้ doc/memory, type-only) → ข้อ 3 ไม่บังคับ

### 4. Commit สะอาด

- conventional message (`feat:`/`fix:`/`docs:`…) · subject ไทยได้ · body ≤100 char/บรรทัด
- ปิดท้าย `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- ไม่มี secret/คีย์หลุด · `.env*` ต้อง gitignore
- งานใหญ่ → **commit ทีละ increment ที่เขียว** (ไม่กองรวมก้อนเดียว)
- ⚠️ commit **เมื่อที่รักสั่งเท่านั้น** (กฎเหล็กใน AGENTS.md)

### 5. รายงานตรง (ห้าม overclaim)

บอกชัด: ผ่านอะไร / ข้ามอะไร / เหลืออะไร. ถ้า test fail หรือข้าม step ให้พูดตรง พร้อม output.
"เสร็จและพิสูจน์แล้ว" = ผ่านข้อ 1-3 จริงเท่านั้น.

## สรุปสั้น (จำ 1 บรรทัด)

> **โค้ดเขียว (lint/type/test) → test ครอบของใหม่ → verify บนจริงถ้าแตะ flow → commit สะอาด (เมื่อสั่ง) → รายงานตรง**

ดูมาตรฐานโค้ดเต็ม: [code-standards.md](code-standards.md)
