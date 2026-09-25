This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Design system

The interface uses semantic CSS tokens defined in `src/app/globals.css`.
Components should consume these tokens instead of hardcoded palette utilities.

- `primary`: main actions and navigation emphasis.
- `income` and `expense`: positive and negative financial values.
- `balance`: balance and neutral financial summaries.
- `success`, `warning`, `info` and `destructive`: feedback states.
- `chart-1` through `chart-5`: data visualization colors.

Shared UI primitives live in `src/components/ui`. Prefer their variants and
the `cn` helper when composing screens. New components should preserve visible
keyboard focus and support mobile layouts without changing financial contracts.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
