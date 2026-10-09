---
name: no-kill-shared-ports
description: ห้ามใช้ pkill/killall ที่ pattern กว้าง และห้ามใช้ port 3000 — เครื่องพี่รันหลายโปรเจคพร้อมกัน
metadata:
  node_type: memory
  type: feedback
  originSessionId: 85f9626f-7b04-49ca-97c2-4a7cc310ba10
  modified: 2026-10-09T00:50:31.399Z
---

เครื่องนี้รันหลายโปรเจค Next.js/Expo พร้อมกัน พี่ห้ามใช้ port 3000 เพราะมีโปรเจคอื่นอยู่

**Why:** ตอน 2026-10-09 ฉันรัน `pkill -f "next dev"` เพื่อ restart dev server ตัวเอง — pattern กว้างเกินไปจึงฆ่า dev server ของทุกโปรเจคในเครื่อง ไม่ใช่แค่ตัวเอง พี่เจอและห้ามไว้

**How to apply:**

- ห้าม `pkill -f <pattern>` / `killall` / `killall node` — ห้ามเด็ดขาด
- ถ้าต้องหยุด process: หา PID เฉพาะก่อน แล้ว verify cwd ว่าเป็นของโปรเจคนี้จริง
  ```bash
  ps aux | grep next | grep -v grep
  lsof -a -p <PID> -d cwd -Fn | grep '^n'   # ยืนยันว่าเป็นโปรเจคนี้
  ```
- port ของโปรเจคนี้: ห้ามใช้ 3000 — ใช้ 3100 ขึ้นไป
- ถ้าจำเป็นต้องเช็คว่า port ว่าง: `lsof -i:<port> -sTCP:LISTEN` ก่อน start เสมอ

โปรเจคอื่นที่รันอยู่ในเครื่องตอนนั้น: chaothuk-app (expo, 8083), comfy-agent/web (pnpm dev), 9router (20128)
ดู [[racing-game-station-dev-server]] เรื่องการรัน dev server ของโปรเจคนี้
