FROM node:22.22.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN npm install --global pnpm@12.8.1
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

ARG CI
ENV CI=$CI

COPY . .

RUN pnpm run build

FROM base
RUN pnpm add --global serve
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
EXPOSE 3000
CMD [ "serve", "-l", "3000", "-s", "build/client", "-L" ]