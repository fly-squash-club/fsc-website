# FSC Website — Handover Checklist

Everything Fly Squash Club needs to own and run flysquash.com independently.

There are **three separate accounts** behind the website. They are independent —
each must be transferred separately.

| # | What | Service | Purpose | Cost |
|---|---|---|---|---|
| 1 | Source code | GitHub | Stores the website files and their history | Free |
| 2 | Hosting | Vercel | Builds the site and serves it to visitors | Free tier is sufficient |
| 3 | Domain name | GoDaddy | Owns `flysquash.com` | ~$20/year (renewal) |

> **Before you start:** create a club-owned email address for these accounts
> (e.g. `it@flysquash.com` or the club's existing admin address) — **not** a
> personal address of a staff member who may leave. All three accounts should be
> registered to that one address.

---

## 1. GitHub — the source code

**Current state:** the code already lives in a club-owned organisation:
**https://github.com/fly-squash-club/fsc-website**

Because it is in an organisation rather than a personal account, **nothing needs
to be transferred** — handing over is just a matter of adding the club's own
GitHub account as an Owner. The repository URL never changes, so the Vercel
connection keeps working untouched.

The repository is **public**. It contains no passwords, keys or private data —
only the website's own code, the images already published on the site, and this
documentation. (Vercel's free plan cannot deploy a private organisation
repository; making it public avoids a subscription. If the club would rather it
were private, upgrade Vercel to Pro and switch the repository to private.)

**Steps**
1. Club creates a GitHub account using the club email.
2. An existing org Owner: **https://github.com/orgs/fly-squash-club/people** →
   **Invite member** → enter that account → role **Owner**.
3. Club accepts the emailed invitation.
4. Keep at least **two** Owners, so no single person is a bottleneck.
5. The previous owner can then step down — or stay on as a second Owner.

**Checklist**
- [ ] Club GitHub account created with the club email
- [ ] That account invited as an organisation Owner, and accepted
- [ ] Two or more owners have access
- [ ] Previous owner removed, if that's the intention

---

## 2. Vercel — the hosting

**Current state:** project `fsc-dynamic`, under a personal Vercel account, and
already connected to the GitHub repository — every push to `main` deploys to
production automatically.

Vercel builds the site whenever the code changes and serves it worldwide. The
free (Hobby) tier is sufficient for this site. Note that Vercel's free tier is
for non-commercial use — for a business, the Pro plan (~US$20/month) is the
correct tier; check Vercel's current terms.

**Two options:**

**Option A — Transfer the existing project** (keeps deployment history)
1. Club creates a Vercel account using the club email, signing in with GitHub.
2. Current owner: Vercel dashboard → project `fsc-dynamic` → **Settings** →
   **Transfer** → choose the club's account/team.
3. Club accepts. Domains move with the project.

**Option B — Recreate it** (simpler, loses history)
1. Club creates a Vercel account and clicks **Add New → Project**.
2. Import the `fsc-website` repository from GitHub.
3. The build settings come from `vercel.json` in the repository — Vite,
   `npm run build`, output `dist`. The site lives at the repository root, so
   leave Root Directory alone.
4. Add the domains `flysquash.com` and `www.flysquash.com`.
5. Delete the old project **only after** confirming the new one serves the site.

**Strongly recommended during this step:** connect the project to the GitHub
repository (Project → Settings → **Git**). This makes every change pushed to
GitHub deploy automatically — which is what allows staff to update the site from
a browser, with no laptop or developer involved. Without it, publishing requires
someone to run `./deploy.sh` from a computer with the Vercel CLI installed.

**Checklist**
- [ ] Club Vercel account created with the club email
- [ ] Project transferred (or recreated and verified)
- [ ] Connected to the GitHub repository for automatic deploys
- [ ] `flysquash.com` and `www.flysquash.com` both resolve and show the site
- [ ] HTTPS padlock works on both

---

## 3. GoDaddy — the domain name

**Current state:** `flysquash.com` registered at GoDaddy.

This is the **most important asset** to secure — if the domain lapses or is lost,
the website address stops working and can be bought by someone else.

**Steps**
1. Club creates a GoDaddy account with the club email.
2. Transfer the domain using GoDaddy's **Account Change** feature (moving a
   domain between GoDaddy accounts is immediate and free — unlike transferring to
   a different registrar, which takes days and incurs a fee).
   GoDaddy → **My Products** → domain → **Account Change**, enter the club's
   GoDaddy account email.
3. Club accepts the transfer.
4. **Turn on auto-renew** and add a payment method that won't expire.
5. Verify the DNS records still point at Vercel:

| Type | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

**Checklist**
- [ ] Club GoDaddy account created with the club email
- [ ] Domain moved into it
- [ ] **Auto-renew ON** with a valid payment method
- [ ] Registrant contact details are the club's, not an individual's
- [ ] DNS records verified as above
- [ ] Domain expiry date noted in the club calendar

---

## 4. Order of operations

Do it in this order to avoid the site going down:

1. Create all three club accounts (GitHub, Vercel, GoDaddy) with the club email
2. Transfer **GitHub** first
3. Then **Vercel**, and reconnect it to the transferred repository
4. Verify flysquash.com still loads correctly — before touching DNS
5. Then transfer the **GoDaddy** domain (DNS records don't change, so the site
   stays up throughout)
6. Turn on auto-renew everywhere
7. Only then remove the previous owner's access

---

## 5. After handover — routine operations

| Task | Who | How |
|---|---|---|
| Update text, photos, news | Club staff | `docs/content-editing.zh.md` |
| Publish changes | Automatic | On save in GitHub, if Git is connected |
| Undo a bad change | Club staff | GitHub → Commits → Revert |
| Emergency rollback | Club staff | Vercel → Deployments → Promote a previous one |
| Design or feature changes | A developer | `docs/technical.en.md` |

**Annual reminders**
- Domain renewal (GoDaddy) — diarise one month before expiry
- Check the club email account used for these services is still monitored

---

## 6. What is *not* included

So there are no surprises:

- No analytics or visitor statistics are installed
- No contact form or database — the site lists phone numbers and WeChat only
- No email hosting (`@flysquash.com` mailboxes, if any, are a separate service)
- No automated tests; changes are verified by looking at the site
- Search-engine link previews for individual news articles are limited (see the
  Technical Guide)
