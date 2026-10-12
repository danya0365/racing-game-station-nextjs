# Racing Game Station — Memory Index

> Active index — โหลดทุก session **คุมให้ ≤150 บรรทัด**
> ดู [MEMORY-GUIDE.md](MEMORY-GUIDE.md) สำหรับวิธีจัดการ (เพิ่ม/archive/promote)

## Core

- [Project Overview](core/project-overview.md) — โปรเจคนี้คืออะไร, stack, โครงสร้าง, **เอกสารอยู่ไหน + ห้ามสร้างซ้ำ**
- [ซาน่า Persona](core/persona.md) — pointer ไปที่ [`.claude/rules/persona.md`](../../rules/persona.md) (เรียก "ที่รัก", ห้ามใช้สรรพนามบุคคล)
- [Conventions](core/conventions.md) — มาตรฐานโค้ด/naming/git (baseline)

## Decisions (ADR)

- [0001 AI Agent Toolkit](decisions/0001-agent-toolkit.md) — ชุดเครื่องมือ Claude ในโปรเจค (persona/memory/hooks/rules/commands)
- [0002 Strangler Fig ไม่ใช่ Hexagonal เต็มรูปแบบ](decisions/0002-strangler-fig-not-full-hexagonal.md) — **ห้ามย้าย architecture ทั้งหมด** · กฎ 3 ข้อ + เฟส 1-5 ที่รออยู่ · อ่านเมื่อจะ refactor
- [0003 Git: Feature Branch เท่านั้น](decisions/0003-git-branch-only.md) — **ห้าม commit ลง main/develop** · มี hook บังคับ · อ่านเมื่อจะ commit/push

## Modules

- [Known Issues Backlog](modules/known-issues-backlog.md) — dead code, dependency ที่ไม่ได้ใช้, ช่องโหว่ที่ยังไม่แก้ · อ่านเมื่อเลือกงานถัดไป

## Feedback

- [ห้าม pkill ที่ pattern กว้าง / ห้ามใช้ port 3000](feedback/no-kill-shared-ports.md) — เครื่องรันหลายโปรเจคพร้อมกัน · **อ่านก่อนหยุด process หรือ start dev server**

## Working Log

- **racing theme เสร็จ flow ลูกค้าแล้ว** — commit 11 ก้อน (`d7f7e02` → `55d4c0b`)
  สีแบรนด์เก่า 2,341 → 5 จุด (5 ที่เหลือคือ rose=danger, blue=Facebook ต้องเก็บ)
  เหลือ: `app/(docs)` 746 · backend 708 (มีธีม 5 ชุดของตัวเอง แยกไว้)
  ยังไม่ทำ: lint 106 errors ของเก่า · build เตือน `middleware` → `proxy`

## Reference

<!-- pattern/สูตรที่ใช้ซ้ำ — ยังไม่มี -->

## Archived

<!-- ของที่ retire ดู _archive/INDEX.md -->
