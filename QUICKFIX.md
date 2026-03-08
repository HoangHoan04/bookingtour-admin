# ⚡ QUICK FIX - Frontend Gọi localhost

## 🎯 Vấn đề

Frontend production đang gọi `localhost:4300` thay vì `api.himlamtourist.xyz`

## ✅ FIX NGAY (3 steps)

### Step 1: Cấu hình Vercel Environment Variables

1. **Vào Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Chọn project `bookingtour-admin`

2. **Settings → Environment Variables:**

   **Thêm 2 variables:**

   ```
   Name: VITE_API_BASE_URL
   Value: https://api.himlamtourist.xyz
   Environment: ✅ Production
   ```

   ```
   Name: VITE_APP_ENV
   Value: production
   Environment: ✅ Production
   ```

3. **Click "Save"**

### Step 2: Redeploy (Không dùng cache)

1. **Vào Deployments tab**
2. Click vào deployment mới nhất
3. Click **⋮** (3 dots) → **Redeploy**
4. **☐ Uncheck** "Use existing Build Cache"
5. Click **Redeploy**
6. Đợi 2-3 phút

### Step 3: Test

1. **Mở admin site:** https://admin.himlamtourist.xyz
2. **Nhấn Ctrl + F5** (hard refresh)
3. **F12 → Console, gõ:**

   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL);
   ```

   **Expected:** `https://api.himlamtourist.xyz` ✅

4. **Try login** → Should work! 🎉

---

## 🧪 Test Tools

### Test tại Browser:

```
https://admin.himlamtourist.xyz/test-api.html
```

### Test Backend:

```bash
# Check backend health
curl https://api.himlamtourist.xyz/health

# Expected: {"status":"ok",...}
```

---

## 🗄️ Check Database Connection (Backend)

### Railway:

```bash
# View logs
railway logs

# Look for:
"Database: bookingtour-db-prod"  ← Production
"Database: bookingtour-db-dev"   ← Development
```

### Run Check Script:

```bash
cd bookingtour-api

# Check current connection
yarn check:db

# Expected output:
✅ Database connection successful!
🌍 Connected to PRODUCTION database
Database: bookingtour-db-prod
```

---

## 🐛 Vẫn Không Fix Được?

### 1. Check Vercel Build Logs:

```
Vercel → Deployments → Latest → View Function Logs
```

Look for: `VITE_API_BASE_URL` có xuất hiện không?

### 2. Check Browser Cache:

```
- Clear cache: Ctrl + Shift + Delete
- Hard refresh: Ctrl + F5
- Try Incognito mode
```

### 3. Check API Backend:

```bash
# Test từ máy local
curl https://api.himlamtourist.xyz/health

# Nếu fail → Backend chưa deploy
# → See: bookingtour-api/TROUBLESHOOTING.md
```

---

## 📚 Chi Tiết Hơn

- **Frontend:** [FIX-LOCALHOST.md](./FIX-LOCALHOST.md)
- **Backend:** [../bookingtour-api/TROUBLESHOOTING.md](../bookingtour-api/TROUBLESHOOTING.md)

---

**Làm 3 steps trên là xong! 🚀**
