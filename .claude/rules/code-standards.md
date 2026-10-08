---
paths:
  - "src/**"
  - "apps/**"
  - "packages/**"
  - "services/**"
---

# Code Standards — Racing Game Station (stack-agnostic baseline)

> โหลดตอนแตะโค้ดจริง · ปรัชญา: **กฎที่ tool บังคับแล้ว ไม่ต้องท่องจำ — รู้ว่ามี gate อะไร + รันยังไง ก็พอ**
> 🚦 **ก่อนบอกว่า "เสร็จ" ต้องผ่าน [Definition of Done](definition-of-done.md)** ทุกครั้ง

## Scoped rules

| ไฟล์                                             | ใช้เมื่อ                                 |
| ------------------------------------------------ | ---------------------------------------- |
| [code-standards.md](code-standards.md) (ไฟล์นี้) | ทุกอย่าง — baseline กลาง                 |
| [frontend-next.md](frontend-next.md)             | แตะ `app/` หรือ `src/` — กฎเฉพาะ Next.js |

## หลักการที่ยึดไว้ก่อน (ยังไม่มี automated gate — ยึดด้วยวินัย)

- **Typed & strict** — ใช้ static type (TS strict / type hints) · หลีกเลี่ยง `any` / untyped boundary
- **Boundaries ชัด** — domain/business logic แยกจาก transport & framework · adapter พึ่ง port/interface กลาง
  ไม่ผูกตรงกับ core · ทิศ dependency: **app/transport → adapter → domain** (ห้ามย้อน) · ห้าม circular
- **No secret in code** — token/API key/secret อยู่ใน env/secret store เท่านั้น · ห้าม commit `.env*`
- **Error handling ชัด** — คืนค่าแบบ explicit (เช่น `Result<T>` / typed error) แทน throw กลาง flow ปกติ ·
  ที่ boundary ภายนอก ต้อง handle failure + retry/log
- **ข้อมูลอ่อนไหว** — ห้าม log ข้อมูลผู้ใช้/PII เป็น plaintext (ดู AGENTS.md ถ้ามีหมายเหตุเฉพาะโดเมน)

## Test conventions (baseline)

- domain/logic กลาง = unit test ครอบ branch ใหม่ทุกอัน
- adapter = contract test (mock + payload จริงจาก docs)
- flow ที่ผู้ใช้เห็น = integration/e2e เมื่อ stack พร้อม

## Git & commit

- flow: ห้าม commit ตรง `main` — แตก `feature/*` เสมอ · commit ตอนพี่สั่งเท่านั้น (ดู AGENTS.md กฎเหล็ก)
- commit message: **conventional** (`feat:`/`fix:`/`chore:`/`docs:`/`refactor:`/`test:`) เนื้อความไทยได้

## Doc/Decision

- กฎใหม่ที่ตกลงกัน → เติมที่นี่ + [conventions.md](../memory/core/conventions.md) · ตัดสินใจใหญ่ → ADR ใน `decisions/` (`/new-adr`)
