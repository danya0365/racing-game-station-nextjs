---
name: conventions
description: มาตรฐานโค้ด/naming/git ของโปรเจค (อ่านก่อนเขียนโค้ดใหม่ หรือเมื่อสงสัยว่าควรวางไฟล์/ตั้งชื่อยังไง) — ชี้ไป code-standards rule ที่โหลดตอนแตะโค้ด
metadata:
  type: convention
  status: active
  scope: global
  updated: 2026-10-08
---

# Coding Conventions

> มาตรฐานเต็ม (โหลดตอนแตะโค้ด) อยู่ที่ [code-standards.md](../../rules/code-standards.md) + [frontend-next.md](../../rules/frontend-next.md)
> ไฟล์นี้สรุปสั้นๆ · 🚦 ก่อนบอกว่า "เสร็จ" ต้องผ่าน [definition-of-done.md](../../rules/definition-of-done.md)

## หลักที่ยึด

- **Typed & strict** — TS `strict: true` ทุกที่ เลี่ยง `any` / untyped boundary
- **Boundaries** — `presentation → application (interface) → infrastructure (impl)` · ห้ามย้อนทิศ
- **No secret in code** — token/secret อยู่ใน env เท่านั้น · `.env*` gitignore แล้ว
- **ห้ามใช้ `SUPABASE_SERVICE_ROLE_KEY`** — โปรเจคนี้ไม่ใช้ ทุกอย่างผ่าน anon key + RLS + RPC guards

## Git

- 🔴 **ห้าม commit ตรง `main` / `develop`** → แตก `feature/*` เสมอ (มี hook บังคับ)
- flow: `feature/<slug>` → `develop` → `main`
- commit **เมื่อพี่สั่งเท่านั้น** (กฎเหล็ก AGENTS.md)
- commit message: **conventional** (`feat:`/`fix:`/`chore:`/`docs:`/`refactor:`/`test:`) เนื้อความไทยได้
- เครื่องใหม่ต้องรัน `npm run setup:git-hooks` ก่อน

รายละเอียด: [[git-workflow-branch-only]]

## Architecture

- 🔴 **ห้ามย้าย architecture เป็น hexagonal เต็มรูปแบบ** — ใช้ Strangler Fig
  1. ฟีเจอร์ใหม่ → เขียนผ่าน presenter เท่านั้น
  2. แตะส่วนไหน → refactor แค่ส่วนนั้น ตอนนั้น
  3. ส่วนที่ไม่เกี่ยวกับงาน → **ห้ามแตะเด็ดขาด**

รายละเอียด: [[0002-strangler-fig-not-full-hexagonal]]

## Naming

| อะไร                 | convention                                       | ตัวอย่าง                                     |
| -------------------- | ------------------------------------------------ | -------------------------------------------- |
| ไฟล์                 | kebab-case (ยกเว้น component/Next.js convention) | `useBackendPresenter.ts` · `booking-flow.md` |
| Component            | PascalCase                                       | `BookingView`                                |
| Hook                 | `use` + PascalCase                               | `useHomePresenter`                           |
| Repository interface | `I<Entity>Repository`                            | `IBookingRepository`                         |
| Presenter            | `<Feature>Presenter`                             | `BookingPresenter`                           |
| Type/interface       | PascalCase                                       | `BookingStatus`                              |
| Env var              | `NEXT_PUBLIC_` ถ้าต้องใช้ฝั่ง client             | `NEXT_PUBLIC_ENABLE_CHAT_WIDGET`             |
| Branch               | `feature/` `fix/` `docs/` `chore/` `refactor/`   | `fix/seed-admin-role`                        |

## ตอนเพิ่มของใหม่

- **หน้าใหม่** → ทำตาม [`prompt/CREATE_PAGE_PATTERN.md`](../../../prompt/CREATE_PAGE_PATTERN.md) (ข้าม section ที่ไม่ตรง stack จริง)
- **Repository ใหม่** → ทำตาม [`prompt/CREATE_REPO_PATTERN.md`](../../../prompt/CREATE_REPO_PATTERN.md)
- **Migration** → ชื่อ `{YYYYMMDDHHMMSS}_{ชื่อ}.sql` เรียงตาม timestamp
- **dependency ใหม่** → ถามพี่ก่อนเสมอ (ตอนนี้มี 10 ตัวติดตั้งแต่ไม่ได้ใช้)
- **feature ใหม่** → `/new-feature` เพื่อสร้าง memory spec

## Gates

```bash
npm run type-check
npm run lint
npm run build
```

ดู [[known-issues-backlog]] · [[project-racing-game-station]]
