# ECEPT — El Conocimiento Es Para Todos 🧬

Medical study web app for med students. Built by a 4th-year student using iPad + AI.
Single HTML file. React 18 from CDN. Zero dependencies. Target: Safari iPadOS/iOS.

## LANGUAGE

- Talk to me in ENGLISH (saves ~30% tokens vs Spanish)
- ALL app content, UI text, medical data → SPANISH (Latin American)
- Code comments → English
- Commit messages → English

## TOKEN DISCIPLINE (CRITICAL)

- Be concise. No preamble. No “Sure!”, “Great question!”, “Here’s what I did:”.
- Don’t repeat my question back. Don’t summarize what you’re about to do.
- Don’t read files you don’t need. Only open files directly relevant to the task.
- Don’t modify files I didn’t ask you to modify.
- Don’t refactor, “improve”, or reorganize code unless explicitly asked.
- Don’t explain changes unless I ask. Just make them.
- If a task touches 1 file, touch 1 file. Not 5.
- When showing code, show ONLY the changed part, not the whole file.
- Prefer `status` over reading every file to understand the project.

## SCOPE RULES

- ONLY modify what I explicitly request
- NEVER touch unrelated files “while you’re at it”
- NEVER add features I didn’t ask for
- NEVER remove existing content without my confirmation
- NEVER invent medical information — if unsure, say so
- If something is ambiguous, pick the most likely interpretation and flag it in 1 line

## TECH STACK

- Output: build/ECSC.html (single concatenated file)
- Build: `node scripts/build.js` (no bundler, no webpack, no npm)
- React: createElement() only — ZERO JSX
- ZERO ES6 imports/exports in final output
- ZERO arrow functions in final output
- localStorage always in try/catch
- Data files: var declarations (not const/let/export)

## REPO STRUCTURE

- src/data/*.js → medical content (one per module)
- src/components/*.js → reusable UI
- src/styles/theme.js → colors (C object)
- src/app.js → main App + routing
- src/index.html → HTML shell
- scripts/build.js → concatenation script
- build/ECSC.html → final output

## GIT / BRANCHES

- main → stable, always buildable
- ALPHA1, ALPHA2, ALPHA3… → sequential feature branches
- Commit messages: short, English, imperative (“add cardiology module”, “fix quiz counter”)
- Always work on the current ALPHA branch, never push to main directly
- When I say “new branch”, increment: ALPHA1 → ALPHA2 → ALPHA3

## SHORTCUTS

- `build` → run scripts/build.js, report file size
- `status` → content inventory + file sizes (don’t read files, just list)
- `add [module]` → new data file in src/data/
- `fix [issue]` → fix specific bug, nothing else
- `integrate [artifact]` → extract data from HTML artifact into correct data file
- `schema [type]` → show data schema for that content type

## DATA SCHEMAS (abbreviated)

- Disease: {id,n,s,cc:{t,p[]},dx:{cr:[{c,d}],df[],nt},ex:{l[],im},tx:{p,q,b,m},px:{e,f[],co[]},pe[],qz:[{p,o[],r,x}]}
- Triad: {ct,nm,en,cp[],cl,ic,dt}
- Lab: {id,label,icon,accent,subtitle,analytes:[{name,range,note,up[],down[]}]}
- Algorithm: {n,t,col,items[],alerta}
- Classification: {id,name,color,icon,def,cl:[{type,desc,etiology,who,tx}]}

## DESIGN SYSTEM

- BG: #060a14 | Cards: #0d1224 | Border: #1a2040
- Text: #e2e8f0 / #94a3b8 / #64748b
- Accent: #3b82f6
- Fonts: Playfair Display (h) + DM Sans (body)
- Always dark mode. 44px min touch targets.

## GOLDEN RULES

1. Treatment always includes specific doses
1. Diagnostic criteria always in table format
1. Every disease needs 3-5 quiz questions minimum
1. Content priority: Tx > Dx > CC > Px > Labs
1. Cross-reference with LinkBadge, never duplicate content
