import re

with open('server/apiRouter.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find all path checks
lines = text.splitlines()
endpoints = []
for i, line in enumerate(lines):
    if '/api/' in line and ('path' in line or 'match' in line):
        endpoints.append((i+1, line.strip()))

print(f"Found {len(endpoints)} endpoint references:")
for line_no, ep in endpoints:
    print(f"L{line_no}: {ep}")
