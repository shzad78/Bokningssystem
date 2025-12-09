# Security Policy

## Security Checks in CI/CD Pipeline

This project includes automated security checks to ensure dependencies are free from known vulnerabilities.

---

## 🔒 Automated Security Audits

### What Gets Checked

Our GitHub Actions CI pipeline automatically runs `npm audit` on every push and pull request to check for:

- **Known security vulnerabilities** in npm dependencies
- **Moderate, High, and Critical** severity issues
- **Both root and frontend** dependencies

### Audit Levels

We check for vulnerabilities at the **moderate** level and above:

```yaml
npm audit --audit-level=moderate
```

This means the pipeline will fail if any of these are found:
- ⚠️ **Moderate** severity vulnerabilities
- 🔴 **High** severity vulnerabilities
- 🚨 **Critical** severity vulnerabilities

**Low** severity issues are reported but don't fail the build.

---

## 🚀 CI/CD Integration

### Pipeline Steps

```yaml
1. Install root dependencies        (npm ci)
2. Install frontend dependencies    (npm ci)
3. Security audit - Root           ✅ npm audit
4. Security audit - Frontend       ✅ npm audit
5. Run linter
6. Run unit tests
7. Run E2E tests
```

If vulnerabilities are found, the pipeline will:
- ❌ **Fail the build**
- 📝 **Show detailed vulnerability report**
- 🚫 **Block merging to main/develop**

---

## 📊 Current Security Status

### Last Check Results
- ✅ Root dependencies: **0 vulnerabilities**
- ✅ Frontend dependencies: **0 vulnerabilities**

### Dependency Counts
- Root: `json-server` and development tools
- Frontend: React, Vite, Testing libraries, Playwright

---

## 🔍 Manual Security Checks

### Check for Vulnerabilities Locally

```bash
# Check root dependencies
npm audit

# Check frontend dependencies
cd frontend && npm audit

# Get detailed report
npm audit --json

# Check only production dependencies
npm audit --production
```

### Fix Vulnerabilities

```bash
# Automatically fix vulnerabilities (if possible)
npm audit fix

# Fix including breaking changes
npm audit fix --force

# For frontend
cd frontend && npm audit fix
```

### View Vulnerability Details

```bash
# See full vulnerability report
npm audit

# Get JSON output for parsing
npm audit --json

# Check specific severity level
npm audit --audit-level=high
```

---

## 🛡️ Security Best Practices

### 1. Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update to latest within semver range
npm update

# Update to latest versions (breaking changes)
npm install <package>@latest
```

### 2. Review Dependency Changes

When updating dependencies:
- ✅ Review changelogs for breaking changes
- ✅ Run full test suite after updates
- ✅ Check for new security advisories
- ✅ Test in staging environment first

### 3. Use Lock Files

**Always commit lock files:**
- ✅ `package-lock.json` (root)
- ✅ `frontend/package-lock.json` (frontend)

These ensure consistent, secure installs across environments.

### 4. Monitor Security Advisories

- 📧 Enable GitHub Dependabot alerts
- 🔔 Subscribe to security advisories for key packages
- 📰 Check npm security advisories regularly

---

## 🔧 Configuration

### Audit Levels Explained

| Level | Description | CI Behavior |
|-------|-------------|-------------|
| **low** | Minor security issues | Report only |
| **moderate** | Moderate security issues | ❌ Fail build |
| **high** | Serious security issues | ❌ Fail build |
| **critical** | Critical vulnerabilities | ❌ Fail build |

### Customize Audit Level

To change the audit level, edit `.github/workflows/ci.yml`:

```yaml
# More strict (fails on low severity)
- run: npm audit --audit-level=low

# Less strict (fails only on high/critical)
- run: npm audit --audit-level=high

# Report only (doesn't fail build)
- run: npm audit
  continue-on-error: true
```

---

## 📋 Common Scenarios

### Scenario 1: Vulnerability Found in CI

**What happens:**
1. CI pipeline runs `npm audit`
2. Vulnerability detected (moderate or higher)
3. Build fails with error message
4. PR cannot be merged

**How to fix:**
```bash
# 1. Pull latest code
git pull origin main

# 2. Check the vulnerability
npm audit

# 3. Try automatic fix
npm audit fix

# 4. If fix available, test and commit
npm run test:unit
git add package-lock.json
git commit -m "Fix security vulnerability in dependencies"
git push
```

### Scenario 2: No Automatic Fix Available

**When `npm audit fix` doesn't work:**

1. **Read the advisory:**
   ```bash
   npm audit
   ```

2. **Check if update available:**
   ```bash
   npm outdated <vulnerable-package>
   ```

3. **Manual update:**
   ```bash
   npm install <package>@latest
   npm run test:unit  # Verify nothing breaks
   ```

4. **If no fix exists:**
   - Check if you actually use the vulnerable code path
   - Consider alternative packages
   - Document the decision to accept the risk (if low impact)
   - Use `npm audit fix --force` (last resort - may break things)

### Scenario 3: False Positives

Some vulnerabilities may not affect your usage:

```bash
# Generate exception (use with caution)
npm audit --json > audit-report.json

# Review and document why vulnerability is not applicable
# Add to documentation or .npmrc exceptions
```

---

## 🚨 Reporting Security Issues

### Found a Security Vulnerability?

**DO NOT** open a public GitHub issue.

Instead:
1. Email the maintainer directly
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

We will respond within 48 hours.

---

## 📈 Security Monitoring

### GitHub Dependabot

Enable Dependabot for automatic security updates:

1. Go to: Settings → Security → Dependabot
2. Enable:
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Dependabot version updates

### Weekly Security Checks

Recommended routine:
```bash
# Monday morning security check
npm audit
cd frontend && npm audit

# Check for outdated packages
npm outdated
cd frontend && npm outdated

# Update dependencies if needed
npm update && npm run test:unit
```

---

## 🔐 Additional Security Measures

### 1. Environment Variables

Never commit sensitive data:
- ❌ API keys
- ❌ Database passwords
- ❌ Secret tokens
- ❌ Private keys

Use `.env` files (already in `.gitignore`).

### 2. Code Quality Tools

Already configured:
- ✅ ESLint (code quality)
- ✅ Vitest (unit tests)
- ✅ Playwright (E2E tests)
- ✅ npm audit (security)

### 3. HTTPS Only

- ✅ Use HTTPS for all external APIs
- ✅ Enable HTTPS in production
- ✅ Set secure headers

### 4. Input Validation

- Validate user input on client and server
- Sanitize data before database operations
- Use parameterized queries (prevent SQL injection)

---

## 📚 Resources

### Official Documentation
- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Tools
- [Snyk](https://snyk.io/) - Advanced vulnerability scanning
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) - Update dependencies
- [audit-ci](https://www.npmjs.com/package/audit-ci) - CI-specific audit tool

---

## ✅ Security Checklist

Before every release:

- [ ] Run `npm audit` locally
- [ ] All CI security checks passing
- [ ] Dependencies up to date
- [ ] No critical/high vulnerabilities
- [ ] Lock files committed
- [ ] Environment variables secured
- [ ] Tests passing (unit + E2E)
- [ ] Code reviewed by team member

---

## 📊 Summary

**Current Status:** ✅ **Secure**

- 🔒 Automated security audits in CI/CD
- 📝 Zero known vulnerabilities
- 🚀 Blocking deployment of insecure code
- 📚 Comprehensive security documentation
- 🛡️ Following security best practices

**Security is everyone's responsibility. Stay vigilant!** 🔐
