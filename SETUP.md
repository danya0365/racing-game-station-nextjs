# SETUP — ตั้งค่าเครื่องใหม่ (AI agent / Claude Code)

โปรเจคนี้เก็บ config ของผู้ช่วย AI (**ซาน่า**) ไว้ใน git ทั้งหมด (ดู [ADR-0001](.claude/memory/decisions/0001-agent-toolkit.md))
เมื่อ `git clone` เครื่องใหม่ ทำตามนี้:

## 1. กด accept workspace-trust (บังคับ)

เปิดโปรเจคใน Claude Code แล้ว **กด accept workspace-trust 1 ครั้ง** —
ค่า `autoMemoryDirectory` และ hooks (`format.sh`, `commit-reminder.sh`) ถึงจะทำงาน

## 2. ตรวจ path ของ memory

`.claude/settings.json` → `autoMemoryDirectory` ชี้ `~/racing-game-station-nextjs/.claude/memory`
ถ้าที่รัก clone ไปไว้ที่อื่น/เปลี่ยนชื่อโฟลเดอร์ → แก้ค่านี้ให้ตรง (จุดเดียว)

## 3. Git hooks (บังคับไม่ให้ commit ผิด branch)

```bash
npm run setup:git-hooks
```

ติดตั้ง `pre-commit` hook ที่ **บล็อกการ commit บน `main` / `master` / `develop`**
และเตือนชื่อ branch ที่ไม่ตรง convention — ดู [ADR-0003](.claude/memory/decisions/0003-git-branch-only.md)

> hook นี้เป็น local (`.git/hooks/` ไม่ถูก commit) → **ต้องรันทุกเครื่อง**

## 4. Auto-format hook — ยังไม่มี Prettier

hook `format.sh` เรียก `npx --no-install prettier` — ตอนนี้โปรเจค**ยังไม่มี Prettier** ติดตั้งไว้
hook จึงเงียบทำงานแบบ no-op (ไม่ error)

ถ้าจะเปิดใช้จริง: `npm i -D prettier` + สร้าง `.prettierrc`

> ⚠️ ระวัง: ถ้าเปิดใช้แล้ว hook จะ format ไฟล์หลังทุก Write → `Edit` ครั้งถัดไปอาจ error
> "stale file" เพราะไฟล์เปลี่ยนบนดิสก์ ต้องอ่านไฟล์ใหม่ก่อน Edit ทุกครั้ง

## 5. (ถ้าจะใช้) MCP — GitHub server

1. `cp .mcp.json.example .mcp.json` (`.mcp.json` ถูก gitignore)
2. สร้าง GitHub personal access token แล้วใส่ใน `.claude/settings.local.json`:
   ```json
   { "env": { "GITHUB_TOKEN": "ghp_xxx" } }
   ```
3. รีสตาร์ท session

## 6. Model / auth

โปรเจคนี้ใช้ auth/model ปกติของ Claude Code
ถ้าอยากตั้งค่า env เฉพาะเครื่อง → สร้าง `.claude/settings.local.json` (gitignore) เอง

---

## ไฟล์ที่ gitignore (สร้างใหม่ต่อเครื่อง)

- `.claude/settings.local.json` — env/ค่าเฉพาะเครื่อง (เช่น GITHUB_TOKEN)
- `.mcp.json` — config MCP จริง (คัดจาก `.mcp.json.example`)
- `CLAUDE.local.md` — note ส่วนตัวต่อเครื่อง (ถ้ามี)

## Slash commands

| Command | ใช้ทำอะไร |
|---------|-----------|
| `/new-feature <ชื่อ>` | สร้าง memory spec ของ feature ใหม่ → `.claude/memory/modules/` |
| `/new-adr` | สร้าง Architecture Decision Record → `.claude/memory/decisions/` |
| `/memory-status` | ตรวจสุขภาพระบบ memory (ขนาด index, จำนวนไฟล์) |
| `/archive-memory <path>` | ย้าย memory ที่เลิกใช้เข้า `_archive/` |
