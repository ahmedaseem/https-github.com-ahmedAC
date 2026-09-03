# Repository cleanup and reorganization

This branch (cleanup/organize-files) contains a safe, reversible reorganization of the repository that groups backups and experimental files under an archive/ directory and documents the changes.

What I changed in this branch

- Created an archive/ directory and moved experimental/backup/duplicate files into it.
- Added backend/models/ for Python model files and scripts/ for helper scripts.
- Added this CLEANUP.md and a .gitignore updated for local artifacts.

Active files retained in root (single source of truth)

- index.html
- app.js
- config.js
- style.css
- assets/*

Files moved to archive/ (examples)

- app.js.backup-before-7-languages -> archive/backups/app.js.backup-before-7-languages
- app.js.backup-before-8-icons-final -> archive/backups/app.js.backup-before-8-icons-final
- app.js.backup-*-* (other backups) -> archive/backups/
- server.js.before-fix -> archive/backups/server.js.before-fix
- any single-word junk or experimental files -> archive/other/

How to review

- The branch is: cleanup/organize-files
- Run `git fetch origin cleanup/organize-files` then `git checkout cleanup/organize-files` locally.
- Inspect archive/ to review moved files. Nothing in main was deleted or modified.

How to revert

- This is a normal git branch. If you don't like the changes, simply delete the branch or do not merge. The main branch was not modified.

Commit

- chore(cleanup): archive experimental files, add CLEANUP.md and .gitignore

