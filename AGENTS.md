# Project Architecture Rules

- Run production and preview builds with a 6 GB Node heap because the combined TanStack Start and Nitro server bundle exceeds Node's default heap limit.