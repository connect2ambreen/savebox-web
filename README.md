# SaveBox — Website

The marketing site for **SaveBox**, served at [savebox.live](https://savebox.live).

Three static pages. There is no build step, no framework and no dependencies:
`index.html` is the site, and `privacy.html` and `delete-account.html` are the
two pages Google Play requires. That is a deliberate choice rather than a stage
it has not grown out of — pages this size gain nothing from a bundler, and a
static file has no build to break, no lockfile to audit and no runtime to patch.

## Local preview

Open a file directly:

```bash
open index.html
```

Or serve the folder, which is closer to production because it exercises the
extensionless URLs:

```bash
npx serve .
```

## Deployment

Served by **GitHub Pages** over the custom domain `savebox.live`. The API is a
separate host entirely — `api.savebox.live` runs on Lightsail behind nginx — so
nothing here talks to anything and there is no origin to configure.

`CNAME` holds the custom domain. It must stay in the repository root: GitHub
rewrites the Pages custom-domain setting from it on every deploy, and a deploy
without it silently drops the domain back to `*.github.io`.

### Where the live copy comes from

The domain currently points at the **`connect2ambreen.github.io`** user-pages
repository, not at this one, so publishing today means copying the three HTML
files across by hand.

That is worth changing. Two copies of a privacy policy is precisely how a
correction gets made in one place and never reaches users — and this policy is
cited by URL in the Play listing, where a stale claim is a compliance problem
rather than a typo. Point Pages at this repository instead:

> `savebox-web` → Settings → Pages → Source: **Deploy from a branch**, `main` / root

Then `git push` is the whole deployment, and the copy in the user-pages repo can
be deleted.

### HTTPS

GitHub issues a Let's Encrypt certificate once the custom domain passes its DNS
check, and **Enforce HTTPS** must be ticked in Settings → Pages. If the domain's
DNS records change afterwards, the certificate does not always reissue on its
own: remove the custom domain, save, re-add it, save again.

Check what is actually being served:

```bash
echo | openssl s_client -connect savebox.live:443 -servername savebox.live 2>&1 | grep subject=
```

`CN=savebox.live` is correct. `CN=*.github.io` means the certificate has not
issued yet and every HTTPS request to the site is failing.

### No custom response headers

GitHub Pages cannot set them, so the strict `Content-Security-Policy`, HSTS and
`Permissions-Policy` this site used to send are gone. For three static pages with
no forms, no user input and no third-party scripts the exposure is small, but it
is a real reduction — restoring it means putting a CDN that can inject headers in
front, or moving the site onto the nginx host that already serves the API.

### Two pages that must stay reachable

`privacy.html` and `delete-account.html` are cited by URL in the Google Play
listing, and Play re-checks them on every update. A 404 or a bad certificate on
either one can block a release. Verify both after any deployment:

```bash
curl -sI https://savebox.live/privacy.html        | head -1
curl -sI https://savebox.live/delete-account.html | head -1
```

GitHub Pages also serves these without the extension, so `/privacy` and
`/delete-account` resolve to the same pages.

## The rest of SaveBox

This site is the public face of a product in two other repositories:

- **[savebox-api](https://github.com/connect2ambreen/savebox-api)** — the Express
  REST API, download worker and database.
- **[savebox-mobile](https://github.com/connect2ambreen/savebox-mobile)** — the
  React Native app for Android and iOS.

The figures quoted on the page — four supported platforms, three quality options,
10 downloads a day, 2 at once, 24-hour retention — are the API's actual defaults.
If those change in `savebox-api`, change them here too.
