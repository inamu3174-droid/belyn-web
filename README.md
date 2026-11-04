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
Checkout creates an **order request**; no payment is taken. `/api/order` and `/api/contact` email Belyn via Resend: set `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` in Vercel. Until set, the site runs in demo mode (confirmation shown, nothing sent; set `VITE_DEMO_MODE=false` to show an error instead). To accept payments add a gateway (e.g. Razorpay) with its secret key on the server only, and re-price items server-side.

## Deploy
1. `git init && git add . && git commit -m "Belyn site"`; create a GitHub repo and push.
2. vercel.com → Add New Project → import the repo. Framework: Other; build `npm run build`, output `dist` (already in `vercel.json`).
3. Add env vars above, deploy. Set `VITE_SITE_URL` (e.g. https://www.belyn.in) for canonical URLs/sitemap. Domain changes are manual.
