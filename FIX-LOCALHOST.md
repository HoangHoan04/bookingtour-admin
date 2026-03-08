# 🔧 Fix: Frontend Gọi localhost Thay Vì Production API

## ❌ Vấn đề

Frontend admin đang gọi `localhost:4300` thay vì `https://api.himlamtourist.xyz`

```
Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:4300/api/admin/auth/login
```

---

## ✅ Giải Pháp

### **Option 1: Cấu hình Vercel Environment Variables (Khuyến nghị)**

#### Bước 1: Vào Vercel Dashboard

1. Truy cập https://vercel.com/dashboard
2. Chọn project `bookingtour-admin`
3. Vào **Settings** → **Environment Variables**

#### Bước 2: Thêm Environment Variables

**Production (Main branch):**

```
Variable Name: VITE_API_BASE_URL
Value: https://api.himlamtourist.xyz
Environment: Production
```

```
Variable Name: VITE_APP_ENV
Value: production
Environment: Production
```

**Development (Develop branch):**

```
Variable Name: VITE_API_BASE_URL
Value: https://dev-api.himlamtourist.xyz
Environment: Preview (develop branch)
```

#### Bước 3: Redeploy

**Sau khi thêm variables:**

1. Vào **Deployments**
2. Click vào deployment mới nhất
3. Click **⋮** (3 dots) → **Redeploy**
4. Chọn **Use existing Build Cache** = OFF
5. Click **Redeploy**

---

### **Option 2: Cập nhật vercel.json và Push**

File `vercel.json` đã có sẵn config, nhưng để chắc chắn:

```json
{
  "env": {
    "VITE_API_BASE_URL": "https://api.himlamtourist.xyz",
    "VITE_APP_ENV": "production"
  },
  "build": {
    "env": {
      "VITE_API_BASE_URL": "https://api.himlamtourist.xyz",
      "VITE_APP_ENV": "production"
    }
  }
}
```

**Sau đó:**

```bash
cd bookingtour-admin
git add vercel.json
git commit -m "Fix: Ensure API URL in vercel.json"
git push origin main
```

---

## 🔍 Kiểm tra API URL Đang Dùng

### Cách 1: Console Browser

Mở admin site, nhấn **F12** (DevTools), gõ:

```javascript
// Check API URL
console.log(import.meta.env.VITE_API_BASE_URL);
```

**Kết quả mong muốn:**

```
https://api.himlamtourist.xyz
```

**Nếu thấy:**

```
http://localhost:4300  ← SAI!
```

→ Vercel chưa load đúng env variables

### Cách 2: Network Tab

1. F12 → Tab **Network**
2. Click nút Login
3. Xem request URL:
   - ✅ Đúng: `https://api.himlamtourist.xyz/api/admin/auth/login`
   - ❌ Sai: `http://localhost:4300/api/admin/auth/login`

---

## 🗄️ Kiểm tra Database Connection (Backend)

### Script 1: Check Database Environment

**Chạy trên Railway/Render:**

```bash
# Railway CLI
railway run node dist/database/check-connection

# Hoặc xem logs
railway logs
```

**Look for:**

```
🔍 Checking Database Connection...
NODE_ENV: production
Database Name: bookingtour-db-prod  ← Production
✅ Database connection successful!
🌍 Connected to PRODUCTION database
```

### Script 2: Test từ Local

```bash
cd bookingtour-api

# Test Production DB
dotenv -e .env.prod -- ts-node src/database/check-connection.ts

# Test Development DB
dotenv -e .env.dev -- ts-node src/database/check-connection.ts
```

**Output mẫu:**

```bash
✅ Database connection successful!
Database: bookingtour-db-prod   # ← "prod" = Production
                                 # ← "dev" = Development
```

### Script 3: Kiểm tra trong Code

Thêm log vào `src/main.ts`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 🔍 Check database info
  console.log("=================================");
  console.log("🗄️  DATABASE INFO:");
  console.log("Database:", configService.get("TYPEORM_DATABASE"));
  console.log("Host:", configService.get("TYPEORM_HOST"));
  console.log("Environment:", configService.get("NODE_ENV"));
  console.log("=================================");

  // ... rest of code
}
```

---

## 🐛 Troubleshooting

### Frontend vẫn gọi localhost sau khi redeploy

**Nguyên nhân:** Build cache

**Fix:**

```bash
# Option A: Clear cache trên Vercel
Vercel Dashboard → Deployments → Latest → ⋮ → Redeploy
☐ Use existing Build Cache (uncheck)

# Option B: Hard refresh browser
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)

# Option C: Clear browser cache
Settings → Privacy → Clear browsing data
```

### CORS Error sau khi fix API URL

**Triệu chứng:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:** Đảm bảo backend có origin của admin:

File `bookingtour-api/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    "https://admin.himlamtourist.xyz", // ← Add this
    "https://himlamtourist.xyz",
    // ... other origins
  ],
  credentials: true,
});
```

### API returns 404

**Check:**

1. Backend đã deploy chưa?

   ```bash
   curl https://api.himlamtourist.xyz/health
   ```

2. DNS đã propagate chưa?

   ```bash
   nslookup api.himlamtourist.xyz
   ```

3. Railway/Render service đang chạy?

---

## 📋 Checklist Fix Frontend

- [ ] **Add environment variables trên Vercel:**
  - [ ] `VITE_API_BASE_URL=https://api.himlamtourist.xyz`
  - [ ] `VITE_APP_ENV=production`

- [ ] **Redeploy Vercel:**
  - [ ] Uncheck "Use existing Build Cache"
  - [ ] Wait for deployment complete

- [ ] **Clear browser cache:**
  - [ ] Hard refresh (Ctrl + F5)
  - [ ] Or clear cache completely

- [ ] **Test:**
  - [ ] F12 → Console → Check `import.meta.env.VITE_API_BASE_URL`
  - [ ] F12 → Network → Check request URL
  - [ ] Try login

- [ ] **Verify backend:**
  - [ ] `curl https://api.himlamtourist.xyz/health`
  - [ ] Check Railway/Render logs

---

## 📋 Checklist Check Database

- [ ] **Check backend logs:**
  - [ ] Railway: Deployments → View Logs
  - [ ] Look for "Database: bookingtour-db-prod"

- [ ] **Run check script:**

  ```bash
  railway run node dist/database/check-connection
  ```

- [ ] **Look for:**
  - [ ] ✅ "Connected to PRODUCTION database"
  - [ ] Database name contains "prod"

---

## 🎯 Quick Check Commands

```bash
# 1. Check frontend API URL (browser console)
console.log(import.meta.env.VITE_API_BASE_URL)

# 2. Check backend health
curl https://api.himlamtourist.xyz/health

# 3. Check DNS
nslookup api.himlamtourist.xyz

# 4. Check database (Railway)
railway run node dist/database/check-connection

# 5. View backend logs
railway logs
```

---

## ✅ Expected Results

**Frontend (Browser Console):**

```javascript
import.meta.env.VITE_API_BASE_URL;
// Output: "https://api.himlamtourist.xyz"
```

**Backend (Railway Logs):**

```
🚀 Application is running on: http://0.0.0.0:4300
🗄️  DATABASE INFO:
Database: bookingtour-db-prod
Host: aws-1-ap-south-1.pooler.supabase.com
Environment: production
```

**Network Tab:**

```
Request URL: https://api.himlamtourist.xyz/api/admin/auth/login
Status: 200 OK
```

---

## 🆘 Vẫn Không Fix Được?

### 1. Share logs với team:

**Frontend:**

- Browser DevTools → Console tab → Copy errors
- Network tab → Copy failed request

**Backend:**

- Railway/Render logs → Copy last 50 lines

### 2. Kiểm tra từng service:

```bash
# Backend health
curl -v https://api.himlamtourist.xyz/health

# Frontend (check HTML source)
curl https://admin.himlamtourist.xyz

# DNS
dig api.himlamtourist.xyz
```

---

**Làm theo checklist trên là sẽ fix được! 🚀**
