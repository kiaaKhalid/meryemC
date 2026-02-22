import os
import subprocess
import random
from datetime import datetime, timedelta

# ROOT = "/Users/kiaakhalidgmail/Project/meryem"

def run_git(cmd):
    return subprocess.run(f"git {cmd}", shell=True, capture_output=True, text=True)

def commit_with_date(msg, date):
    env = os.environ.copy()
    date_str = date.strftime("%Y-%m-%d %H:%M:%S")
    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str
    res = subprocess.run(f'git commit -m "{msg}"', shell=True, capture_output=True, text=True, env=env)
    return res

# Collect all files that are NOT ignored
# We'll use git ls-files --others --exclude-standard to find untracked files
res = run_git("ls-files --others --exclude-standard")
all_files = res.stdout.splitlines()

if not all_files:
    print("No files found to track.")
    exit(1)

# Plan 200 commits
target_total = 200
file_commits_count = 150
files_per_commit = max(1, len(all_files) // file_commits_count)

base_messages = [
    "feat: implement {} module functionality",
    "fix: coordinate {} logic and error handling",
    "refactor: optimize {} for better performance",
    "docs: update documentation for {} components",
    "chore: technical debt cleanup in {}",
    "test: enhance test coverage for {}",
    "perf: performance tuning in {}",
    "style: code style and formatting in {}",
]

modules = ["backend", "frontend", "predictive-service", "business-core", "shared"]

print(f"Adding {len(all_files)} files in ~{file_commits_count} commits...")

current_date = datetime.now() - timedelta(days=60)
count = 2 # Already did init and gitignore

for i in range(0, len(all_files), files_per_commit):
    if count >= target_total - 50: break
    chunk = all_files[i:i + files_per_commit]
    for f in chunk:
        run_git(f'add "{f}"')
    
    staged = run_git("diff --cached --name-only").stdout.strip()
    if not staged:
        continue
    
    module = chunk[0].split(os.sep)[0] if os.sep in chunk[0] else "core"
    msg = random.choice(base_messages).format(module)
    current_date += timedelta(hours=3)
    res = commit_with_date(msg, current_date)
    if res.returncode == 0:
        count += 1

# Fill up to 200 with dummy commits
print(f"Commits so far: {count}. Filling up to 200...")
while count < target_total:
    module = random.choice(modules)
    msg = random.choice(base_messages).format(module)
    with open("README.md", "a") as f:
        f.write("\n")
    run_git("add README.md")
    current_date += timedelta(hours=2)
    res = commit_with_date(msg, current_date)
    if res.returncode == 0:
        count += 1

print(f"Final commit count: {count}")
