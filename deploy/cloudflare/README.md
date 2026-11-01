This folder is a reference only. The live Wrangler config is `/wrangler.jsonc`
at the project root — that is what `npx wrangler deploy` reads.

Cloudflare Workers Builds should use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`npm run build` detects `WORKERS_CI=1` and runs `opennextjs-cloudflare build`.
