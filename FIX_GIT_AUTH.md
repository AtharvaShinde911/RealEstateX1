# Fix Git Authentication Issue

The error shows git is trying to authenticate as `paymon666` but you need to authenticate as `AtharvaShinde911`.

## 🔧 Solution Options:

### Option 1: Use SSH (Recommended)

1. **Change remote to SSH:**
```bash
git remote set-url origin git@github.com:AtharvaShinde911/RealEstateX1.git
```

2. **Push again:**
```bash
git push -u origin main
```

**If you don't have SSH keys set up:**
- Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
- Add to GitHub: https://github.com/settings/keys
- Copy public key: `cat ~/.ssh/id_ed25519.pub`
- Add it to GitHub → Settings → SSH and GPG keys

### Option 2: Update HTTPS Credentials

1. **Clear cached credentials:**
```bash
git credential-osxkeychain erase
host=github.com
protocol=https
```

2. **Push again (will prompt for credentials):**
```bash
git push -u origin main
```

Enter your GitHub username (`AtharvaShinde911`) and password/token when prompted.

### Option 3: Use Personal Access Token

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Select scopes: `repo` (full control)
   - Copy the token

2. **Update remote URL with token:**
```bash
git remote set-url origin https://AtharvaShinde911:YOUR_TOKEN@github.com/AtharvaShinde911/RealEstateX1.git
```

Replace `YOUR_TOKEN` with your actual token.

3. **Push:**
```bash
git push -u origin main
```

### Option 4: Use GitHub CLI (Easiest)

1. **Install GitHub CLI** (if not installed):
```bash
brew install gh
```

2. **Authenticate:**
```bash
gh auth login
```

3. **Push:**
```bash
git push -u origin main
```

---

## ✅ Quick Fix (Try This First):

Run these commands:

```bash
# Clear old credentials
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https
EOF

# Update remote URL
git remote set-url origin https://github.com/AtharvaShinde911/RealEstateX1.git

# Try pushing (will prompt for your GitHub credentials)
git push -u origin main
```

When prompted:
- Username: `AtharvaShinde911`
- Password: Use a Personal Access Token (not your GitHub password)

---

## 🔑 Create Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "RealEstateX1 Project"
4. Select scope: `repo` (check the box)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

---

**Try Option 4 (GitHub CLI) first - it's the easiest!**

