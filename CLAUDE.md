# CLAUDE.md — Racing Game Station

คู่มือให้ AI agent (Claude Code) ทำงานกับโปรเจคนี้

อ่าน [README.md](./README.md) ก่อนเพื่อเข้าใจสถาปัตยกรรม แล้วค่อยอ่านไฟล์นี้

---

## 🔴 กฎข้อบังคับ: Git Workflow

**ห้าม commit ลง `main` และ `develop` โดยตรงเด็ดขาด — ต้องสร้าง feature branch เสมอ**

### Branch ที่แตะได้

| Branch | ห้าม push ตรง? | ใช้ทำอะไร |
|--------|--------------|-----------|
| `main` | ✅ ห้าม | production — อัปเดตจาก `develop` เท่านั้น ผ่าน PR |
| `develop` | ✅ ห้าม | integration — อัปเดตจาก feature branch เท่านั้น ผ่าน PR |
| `feature/*` `fix/*` `docs/*` `chore/*` `refactor/*` | — | ทำงานปกติ ✅ |

### เริ่มงานใหม่ทุกครั้ง

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<slug>
```

ตัวอย่าง slug: `booking-slot-validation`, `walkin-queue-ui`, `seed-admin-role`

**ถ้ามีงานค้างอยู่ใน working tree แล้ว** — สร้าง branch ต่อได้เลย (`git checkout -b feature/x`) การเปลี่ยน branch จะพาการแก้ไขติดไปด้วย ไม่ต้องกลัว

### Commit

```bash
git add <ไฟล์>
git commit -m "..."
git push -u origin feature/<slug>
```

### PR

```
feature/<slug>  ──►  develop  ──►  main
```

- ทุก PR เปิดเข้า `develop`
- `main` อัปเดตจาก `develop` เท่านั้น (ปล่อยให้ Vercel auto-deploy จาก push เข้า `main`)
- ไม่ commit ข้ามจาก feature branch ไป `main` ตรง

### Commit message

ใช้ Conventional Commits (repo ใช้สไตล์นี้อยู่แล้ว):

```
<type>(<scope>): <รายละเอียดสั้น เป็นภาษาไทยหรืออังกฤษก็ได้>

type:  feat | fix | docs | refactor | chore | perf | test | style
scope: ชื่อโมดูล เช่น booking, walk-in, auth, chat, theme
```

ตัวอย่าง:

```bash
git commit -m "fix(auth): ตรวจ ownership ใน rpc_get_my_bookings ก่อนคืนข้อมูล"
git commit -m "docs: อัปเดต README ให้ตรงกับโค้ดปัจจุบัน"
git commit -m "feat(walk-in): เพิ่มปุ่มยกเลิกคิวในหน้าสถานะ"
```

### ถ้า commit ตรง `develop`/`main` พลาดไปแล้ว

```bash
git reset --soft HEAD~1     # ย้อน commit ทิ้ง แต่เก็บการแก้ไขไว้
git checkout -b fix/<slug>
git commit -m "<ข้อความเดิม>"
```

ถ้า push ไปแล้ว: `git push --force-with-lease origin develop` (ปลอดภัยกว่า `--force` — จะไม่ทับถ้ามีคน push ทับระหว่างนั้น)

### Enforcement

มี `pre-commit` hook ที่บล็อกการ commit บน `main`/`develop` — ดู [scripts/git-hooks/pre-commit](./scripts/git-hooks/pre-commit)

หลัง clone ใหม่ต้องเปิดใช้งาน:

```bash
npm run setup:git-hooks
```

ข้าม hook ได้เมื่อจำเป็นจริง ๆ: `git commit --no-verify`

---

## กฎการทำงานทั่วไป

### ห้าม

- แก้ `package.json` version โดยไม่ได้รับคำสั่ง
- เพิ่ม dependency ใหม่โดยไม่ถาม
- ใช้ `any` เพื่อให้ type-check ผ่าน
- เขียน business logic ใน `app/` — ต้องอยู่ใน `src/presentation/presenters/`
- ให้ component เรียก repository ตรง ๆ (มีแค่ 3 ตัวที่ทำผิดอยู่แล้ว อย่าเพิ่ม)

### Architecture

- `app/` = routing เท่านั้น
- Business logic → `src/presentation/presenters/`
- Data access → `src/application/repositories/` (interface) + `src/infrastructure/repositories/` (implementation)
- Client ใช้ `Api*Repository` (ผ่าน `/api/*`) — Server ใช้ `Supabase*Repository`
- เพิ่มหน้าใหม่ → ทำตาม [`prompt/CREATE_PAGE_PATTERN.md`](./prompt/CREATE_PAGE_PATTERN.md)
- เพิ่ม repository ใหม่ → ทำตาม [`prompt/CREATE_REPO_PATTERN.md`](./prompt/CREATE_REPO_PATTERN.md)

### ก่อนจบงาน

```bash
npm run type-check
npm run lint
npm run build
```

### ก่อน commit

อ่าน [README.md → Known Issues](./README.md#-known-issues--สิ่งที่ยังต้องแก้) — อย่าเพิ่มรายการใหม่โดยไม่บอกผู้ใช้

---

## เอกสาร

| ไฟล์ | ใช้เมื่อ |
|------|--------|
| [README.md](./README.md) | เข้าใจระบบทั้งหมด |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | deploy ไป Vercel / Supabase |
| [docs/audit/](./docs/audit/) | ตรวจสอบช่องโหว่ — **ล้าสมัย** ดู Known Issues ใน README แทน |
| [prompt/](./prompt/) | ต้นแบบสร้างหน้า / repository ใหม่ |
