---
name: git-workflow-branch-only
description: ห้าม commit ลง main/develop โดยตรงเด็ดขาด ต้องสร้าง feature branch เสมอ — อ่านเมื่อจะ commit หรือ push
metadata:
  type: convention
  status: active
  scope: global
  updated: 2026-10-08
---

# Git Workflow: Feature Branch เท่านั้น

## กฎเหล็ก

**ห้าม commit ลง `main` และ `develop` โดยตรงเด็ดขาด — ต้องสร้าง feature branch เสมอ**

| Branch                                                                | push ตรงได้? | หมายเหตุ                                             |
| --------------------------------------------------------------------- | ------------ | ---------------------------------------------------- |
| `main`                                                                | ❌           | production — อัปเดตจาก `develop` เท่านั้น ผ่าน PR    |
| `develop`                                                             | ❌           | integration — รับจาก feature branch เท่านั้น ผ่าน PR |
| `feature/*` `fix/*` `docs/*` `chore/*` `refactor/*` `test/*` `perf/*` | ✅           | ทำงานปกติ                                            |

## ทำไม

งานขึ้น production แล้วที่ <https://racing-game-station.vercel.app/> มีผู้ใช้จริง
commit ผิดที่แล้ว rollback ยาก ต่างจากโปรเจคส่วนตัวที่ commit ตรงได้

## เริ่มงานใหม่

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<slug>
```

slug ตัวอย่าง: `booking-slot-validation` · `walkin-queue-ui` · `seed-admin-role`

ถ้ามีงานค้างใน working tree แล้ว — สร้าง branch ต่อได้เลย (`git checkout -b feature/x`)
การเปลี่ยน branch จะพาการแก้ไขติดไปด้วย ไม่ต้องกลัว

## Flow

```
feature/<slug>  ──►  develop  ──►  main
```

ทุก PR เปิดเข้า `develop` · `main` อัปเดตจาก `develop` เท่านั้น

## Hook บังคับ

ติดตั้งด้วย `npm run setup:git-hooks` (ติดตั้งแล้วในเครื่องนี้)

| กรณี                                    | ผล                          |
| --------------------------------------- | --------------------------- |
| commit บน `main` / `master` / `develop` | ❌ บล็อก                    |
| ชื่อ branch นอก convention              | ❌ บล็อก + บอกชื่อที่ควรใช้ |
| commit message ว่าง                     | ❌ บล็อก                    |

ข้ามได้เมื่อจำเป็นจริง:

```bash
git commit --no-verify                  # ข้ามทั้งหมด
SKIP_BRANCH_CHECK=1 git commit -m "..."  # ข้ามแค่การตรวจชื่อ branch
```

⚠️ **hook เป็น local ไม่ติดตั้งตอน clone** (`.git/hooks/` ไม่ถูก commit)
เครื่องใหม่ / session ใหม่ / คนใหม่ต้องรัน `npm run setup:git-hooks` ก่อน

## Commit message

Conventional Commits (repo ใช้สไตล์นี้อยู่แล้ว):

```
<type>(<scope>): <รายละเอียด>

type:  feat | fix | docs | refactor | chore | perf | test | style
scope: booking | walk-in | auth | chat | theme | seed | ...
```

ตัวอย่างจริงที่ใช้แล้ว:

```
docs: อัปเดตเอกสารทั้งหมดให้ตรงกับโค้ดจริง + เพิ่ม Git Workflow
feat: add createOrUpdateCustomer method to MockCustomerRepository
refactor BookingStatusView to use CSS custom properties for accent colors
```

## แก้เมื่อ commit พลาด

```bash
git reset --soft HEAD~1      # ย้อน commit ทิ้ง แต่เก็บการแก้ไขไว้
git checkout -b fix/<slug>
git commit -m "<ข้อความเดิม>"
```

ถ้า push ไปแล้ว: `git push --force-with-lease origin develop`
(ปลอดภัยกว่า `--force` — จะไม่ทับถ้ามีคน push ทับระหว่างนั้น)

## กฎอื่น

**ห้าม commit โดยไม่ได้รับคำสั่ง** — ทำงานใน working tree รอที่รักสั่ง "commit" หรือ "push" ก่อน
แม้จะเป็น "wip" หรือ "ควร commit ไว้ก่อน" ก็ตาม

ดู [[0002-strangler-fig-not-full-hexagonal]] · [[project-racing-game-station]]
