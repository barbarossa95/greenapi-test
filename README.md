# Green API

Web chat client for Telegram built on [GREEN-API](https://green-api.com/telegram/docs/).

## Requirements

- Node.js 22.22+ (see `.nvmrc`)
- pnpm 12.8.1 (pinned in `package.json`, enable it with `corepack enable`)
- A GREEN-API Telegram instance

## Run locally

```sh
nvm use
corepack enable
pnpm install
pnpm dev
```

Open http://localhost:3000.

On first launch the app asks for the instance credentials: `idInstance`,
`apiUrl` and `apiTokenInstance`. They are shown in the
[GREEN-API console](https://console.green-api.com) and saved in the browser's
local storage.

### Instance settings

Incoming messages are received via the HTTP API (`receiveNotification`), so in
the instance settings:

- leave the webhook URL empty
- enable notifications about incoming messages
- enable notifications about outgoing message statuses to see delivered and
  read ticks

## Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `pnpm dev`    | Start the dev server on port 3000    |
| `pnpm build`  | Production build                     |
| `pnpm test`   | Typecheck, Prettier check and ESLint |
| `pnpm unit`   | Unit tests (Vitest)                  |
| `pnpm lint`   | ESLint                               |
| `pnpm format` | Format with Prettier                 |
