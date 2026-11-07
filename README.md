# BELYN web

Recreation of the lime-green reference site for Belyn. React 19 + TypeScript, GSAP/ScrollTrigger, matter-js (footer letters), built with esbuild.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Replace placeholders (important)
- `src/data/products.ts`: **prices and sizes are placeholders** (belyn.in was unreachable when this was built). Enter real values, then set `PRICES_ARE_PLACEHOLDERS = false` (hides the tags, enables product structured data).
- Product photos: put files in `public/images/products/`, set `image: '/images/products/x.jpg'` per product. Editorial/journal visuals are drawn placeholders in `src/components/Art.tsx` (`Scene`).
- Contact details default to `hello@belyn.in` and `9596481999` (WhatsApp link included). Override with `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE`, `VITE_WHATSAPP_NUMBER`, `VITE_INSTAGRAM_URL`.
- Policy pages (`src/pages/Policy.tsx`) and story copy (`src/pages/Story.tsx`) need Belyn's official text.

## Orders, contact, payments

### Email (Resend)
`/api/order` and `/api/contact` email Belyn via Resend. Set on Vercel:
- `RESEND_API_KEY`
- `MAIL_FROM` (verified sender, e.g. `Belyn <hello@belyn.in>`)
- `MAIL_TO` (inbox that receives orders/messages)

Until set, the site can run in demo mode (`VITE_DEMO_MODE=true`).

### Online payments (Razorpay)
Checkout supports **Pay online** (UPI / card / netbanking) via Razorpay, plus COD and manual UPI.

Set on Vercel (server-only — never put the secret in frontend code):
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Flow: create order → Razorpay Checkout → signature verify → order email to `MAIL_TO`.

Use **Test keys** from the Razorpay dashboard while developing; switch to **Live keys** for production after KYC is approved.

## Deploy
1. Push to GitHub.
2. vercel.com → import the repo. Framework: Other; build `npm run build`, output `dist` (see `vercel.json`).
3. Add env vars above, redeploy. Set `VITE_SITE_URL` (e.g. https://www.belyn.in) for canonical URLs/sitemap.
