# Dokploy deployment

Use the application build type **Dockerfile**.

## Source

- Provider: GitHub
- Repository: `infyramy/zi-portfolio`
- Branch: `zi-portfolio`

## Build

- Dockerfile path: `Dockerfile`
- Docker context path: `.`
- Docker build stage: leave empty
- Environment variables: none required

## Domain

- Container port: `80`
- Health check path: `/healthz`
- HTTPS: enable through Dokploy after the domain resolves

The image builds the Vite site with Node and serves the generated files through
Nginx. Client-side routes fall back to `index.html`, while hashed assets receive
long-lived cache headers.
