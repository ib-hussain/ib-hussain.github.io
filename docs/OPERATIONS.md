# Operations and acceptance

## Current status

- Prototype available locally, not deployed. No connected uptime analytics service.
- Offline-capable core pages; the archived component lab may fetch third-party media.
- No visitor data is collected, and no backend logs are sent anywhere.

## Acceptance gate for publication

1. Verify all work experience dates, contributions and job availability language.
2. Confirm attribution/licensing for archived reusable third-party components.
3. Review each window control, keyboard focus order, 1-second intro timing, reduced-motion behaviour, theme switch and dock relocation.
4. Run static tests, validate HTML/CSS, test at 1600×900, 1366×768, 768×1024 and 390×844 and collect screen-reader and Lighthouse results.
5. Snapshot and validate backup before promotion; deploy from a reviewed tagged commit.
6. Configure external uptime monitoring and CI deploy notifications only after URL is live; keep a roll-back release copy.

## Audit and rollback

Check Git commit history and CI checks for file-level audit trail, use `python scripts/backup.py` and `python scripts/restore.py` to verify local recovery. Update CHANGELOG for all accepted design changes. Production promotion is intentionally not automated until the repository/branch is approved.
