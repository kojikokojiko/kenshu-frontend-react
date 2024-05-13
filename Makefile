.PHONY: init
init:
	pnpm i
	pnpm --filter api db:push
	pnpm --filter api db:seed
	pnpm --filter api build

.PHONY: api-start
api-start:
	pnpm --filter api start
.PHONY:app-start

app-start:
	pnpm --filter @kenshu-frontend/app run dev

.PHONY: open-db
open-db:
	pnpm --filter api db:open
