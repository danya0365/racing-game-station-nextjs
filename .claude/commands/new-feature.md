---
description: สร้าง memory spec ของ feature ใหม่ใน Racing Game Station (booking / walk-in / chat / auth / machine / session)
argument-hint: "[ชื่อ feature] เช่น booking-slot"
---

สร้าง memory spec สำหรับ feature ใหม่ตาม convention ใน `.claude/memory/MEMORY-GUIDE.md`
ชื่อ feature: **$ARGUMENTS**

> 📌 โปรเจคนี้มี feature ชัดเจนอยู่แล้ว: `booking` · `walk-in` · `chat` · `auth` · `machine` · `session` · `customer` · `dashboard`
> ใช้ชื่อที่ตรงกับ feature นั้น เพื่อให้เชื่อมกับ [[known-issues-backlog]] และ ADR ได้

ทำตามขั้นตอนนี้:

1. แปลงชื่อเป็น kebab-case → สร้างไฟล์ `.claude/memory/modules/<slug>.md`
   → เขียนลง `.claude/memory/modules/<slug>.md`
2. frontmatter มาตรฐาน (`type: module`, `status: active`, `scope: <slug>`, `updated` = วันนี้)
3. โครงเนื้อหา spec (เว้นที่ให้เติม): **หน้าที่/ขอบเขต / interface (input↔output) / dependency /
   ปม technical ที่ต้องระวัง / test ที่ต้องมี**
   - ถ้ายังไม่รู้รายละเอียด ให้ถามที่รักทีละจุด หรือใส่ TODO ไว้
4. เพิ่ม pointer ใน section "Modules" ของ `.claude/memory/MEMORY.md`
5. (ถ้าเริ่ม coding แล้ว) เสนอว่าจะ scaffold โครงโค้ดต่อเลยไหม
