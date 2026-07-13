# Mana Portal

Read-only operations monitoring portal for the Mana coordination platform — the admin/finance-facing dashboard described in the FreshRoute SA system overview (dashboard → coordinator app → buyer/driver app rollout).

Built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui-style components.

## Pages

- **Dashboard** — KPI overview (repeat buyers, weekly order value, commission revenue, unpaid balance, rejected-produce rate, on-time delivery rate, farmer fulfillment rate) plus a quality-grade breakdown chart.
- **Farmers** — registered farmers and their harvest/fulfillment/payout history.
- **Buyers** — registered buyers, order history, and outstanding balances.
- **Buyer Requests** — demand submitted by buyers, awaiting supply matching.
- **Orders** — every confirmed order with payment, tracking, and delivery status.
- **Quality** — inspection pass/reject/pending counts and grade distribution.
- **Deliveries** — pickup/delivery status and driver assignment per order.
- **Payments** — buyer invoices and farmer settlements, with outstanding totals.

This portal is monitoring-only by design — no approve/match/pay actions ship here yet, matching the "keep the pilot controlled" guidance in the business-model docs. Those actions live in the coordinator role of the [mana-app](../mana-app) mobile app instead.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your mana-backend instance
npm run dev
```

Requires a running [mana-backend](../mana-backend) instance and an `admin` or `finance` role user (seeded demo accounts: `lani.maluleke@freshroute.co.za` / `naledi.sithole@freshroute.co.za`, password `password123`).

## Build

```bash
npm run build
npm run preview
```
