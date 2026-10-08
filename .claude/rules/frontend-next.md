---
paths:
  - "app/**"
  - "src/**"
---

# Frontend Rule — Next.js App Router (Racing Game Station)

> โหลดตอนแตะ `app/` หรือ `src/` · baseline กลางอยู่ที่ [code-standards.md](code-standards.md)
> 🚦 ก่อนบอกว่า "เสร็จ" ต้องผ่าน [Definition of Done](definition-of-done.md)

## Architecture ปัจจุบัน: ports & adapters (อยู่แล้ว — อย่ารื้อ)

```
app/ (Server Component)  ──►  createServer*Presenter  ──►  Supabase*Repository
     │                                                              (Supabase anon + RLS)
     ▼  props: initialViewModel
XView (Client)  ──►  useXPresenter  ──►  XPresenterClientFactory  ──►  Api*Repository
                                                                            │ fetch
                                                                            ▼
                                                                    app/api/* route handler
```

**ทิศ:** `presentation → application (interface) → infrastructure (impl)`

### กฎ

| กฎ                                           | รายละเอียด                                                                                |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `app/` = routing เท่านั้น                    | page / layout / loading / route.ts · business logic อยู่ใน `src/presentation/presenters/` |
| Presenter class ห้าม import `infrastructure` | ใช้ constructor injection — factory เป็น composition root (import ได้)                    |
| Component ห้าม import `RepositoryFactory`    | ใช้ `useXPresenter()` เสมอ                                                                |
| Client ใช้ `Api*Repository`                  | ผ่าน `/api/*` — เลี่ยง connection pool ของ Supabase บน browser                            |
| Server ใช้ `Supabase*Repository`             | anon key + cookie session — บังคับใช้ RLS อยู่แล้ว                                        |
| ห้ามใช้ `SUPABASE_SERVICE_ROLE_KEY`          | โปรเจคนี้ไม่ใช้เลย — ทุกอย่างผ่าน RLS + RPC guards                                        |

⚠️ **ยังไม่มี automated gate บังคับกฎเหล่านี้** — ยึดด้วยวินัย
(เฟส 1 ของ [ADR-0002](../memory/decisions/0002-strangler-fig-not-full-hexagonal.md) จะเพิ่ม dep-cruiser)

### 3 component ที่ยังผิดกฎ (รู้ไว้ — แก้ตอนแตะ ไม่ต้องรีบ)

`BookingsTab.tsx` · `BookingStatusView.tsx` · `BookingHistoryView.tsx`
→ ทั้งหมดเป็น feature booking และ `BookingPresenter` มีอยู่แล้ว ย้ายเข้าไปได้ (เฟส 5)

## สร้างหน้าใหม่

ทำตาม [`prompt/CREATE_PAGE_PATTERN.md`](../../prompt/CREATE_PAGE_PATTERN.md)

> ⚠️ template นั้นเขียนตอน stack ยังไม่ชัดเจน — ข้าม section ที่ไม่ตรงกับของจริง (preset framework, Docker, Traefik, PostgreSQL ตรง) · ใช้แค่โครง Repository/Presenter/Hook

## Data access

- **ทุก query ที่ต้องการอนุธรรมผ่าน PostgreSQL RPC** (`SECURITY DEFINER`) — ไม่มี client เขียนตารางตรง
- **การคำนวณซับซ้อนอยู่ฝั่ง DB** — ลด N+1, ควบคุมสิทธิ์ที่ server
- **ห้าม leak error ของ Postgres ถึง client** — ครอบเป็นข้อความกลาง
- **Validation:** ตอนนี้ทำมือใน route (`if (!field)`) — `zod` ติดตั้งไว้แต่ยังไม่ได้ใช้ ถ้าจะเพิ่มให้ใช้

## Time & Pricing — ห้าม hardcode

| อะไร            | อยู่ที่ไหน                                                           |
| --------------- | -------------------------------------------------------------------- |
| ราคา / ระยะเวลา | `src/config/booking.config.ts` → `DURATION_OPTIONS`                  |
| เวลาทำการ       | `OPERATING_HOURS` — ⚠️ `isOpen24Hours: true` override `open`/`close` |
| Timezone ร้าน   | `TIMEZONE_CONFIG.defaultBusinessTimezone = 'Asia/Bangkok'`           |
| กติกาลูกค้า     | `src/config/customerConfig.ts`                                       |
| Feature toggle  | `NEXT_PUBLIC_*` ใน `.env` อ่านผ่าน `src/config/auth.config.ts`       |

ใช้ `getShopNow()` / `getShopTodayString()` จาก `src/lib/date.ts` — อย่าเรียก `new Date()` ตรงๆ ใน logic ที่ต้องตรงเวลาร้าน

## Styling (Tailwind v4)

- **CSS ทั้งหมดอยู่ที่ `public/styles/`** — `index.css` เป็น entry เดียว (import ใน `app/layout.tsx`)
- **Dark mode = class-based** (`@custom-variant dark`) — ไม่ใช่ `prefers-color-scheme`
- **ใช้ semantic token** ไม่ใช่สีตรง: `bg-background` `text-foreground` `text-muted` `border-border` `text-success` `bg-accent-purple`
- **Utility ที่มีอยู่:** `gradient-purple|cyan|pink|green|orange` (+ `-bg`) · animation-delay 100-500
- `/backend/control` มีธีมแยก 5 ชุด (`useControlThemeStore`) — ไม่เกี่ยวกับ global theme

## เพิ่ม dependency

**ถามก่อนเสมอ** — ตอนนี้มี 10 ตัวติดตั้งไว้แต่ไม่ได้ใช้
ดู [known-issues-backlog](../memory/modules/known-issues-backlog.md)

## Gates

```bash
npm run type-check
npm run lint
npm run build
```

> ⏳ `dep-cruiser` + CI ยังไม่มี (เฟส 1) — ถ้าเห็น gate ใหม่ใน `package.json` ให้รู้ว่าเพิ่งถูกเพิ่ม

ดู [ADR-0002](../memory/decisions/0002-strangler-fig-not-full-hexagonal.md) · [project-overview](../memory/core/project-overview.md)
