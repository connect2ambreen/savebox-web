# SaveBox — Website

The marketing site for **SaveBox**, served at [savebox.live](https://savebox.live).

A single static page. There is no build step, no framework and no dependencies:
`index.html` is the site, and `vercel.json` sets the response headers. That is a
deliberate choice rather than a stage it has not grown out of — a page this size
gains nothing from a bundler, and a static file has no build to break, no
lockfile to audit and no runtime to patch.

## Local preview

Open the file directly:

```bash
open index.html
```

Or serve it, which is closer to production because it exercises `cleanUrls`:

```bash
npx serve .
```

## Deployment

Deployed by [Vercel](https://vercel.com), which builds from `main` on every push.
No environment variables are needed — the page talks to nothing.

`vercel.json` sets a strict Content-Security-Policy along with HSTS,
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and a
`Permissions-Policy` that turns off camera, microphone, geolocation and
interest-cohort. The CSP allows inline `<style>` and `<script>` because both live
in the page; if either ever moves to a file, tighten those two directives.

## The rest of SaveBox

This site is the public face of a product in two other repositories:

- **[savebox-api](https://github.com/connect2ambreen/savebox-api)** — the Express
  REST API, download worker and database.
- **[savebox-mobile](https://github.com/connect2ambreen/savebox-mobile)** — the
  React Native app for Android and iOS.

The figures quoted on the page — four supported platforms, three quality options,
10 downloads a day, 2 at once, 24-hour retention — are the API's actual defaults.
If those change in `savebox-api`, change them here too.
