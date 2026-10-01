# Project Architecture Rules

- Run production and preview builds with a 6 GB Node heap because the combined TanStack Start and Nitro server bundle exceeds Node's default heap limit.
- Render stored email HTML through the server-only HTML-to-PDF adapter because the deployed runtime cannot launch a local browser process.