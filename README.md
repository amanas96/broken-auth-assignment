# 🛠️ Broken-Auth-Assignment - Fixed & Documented

This repository contains the solution to the "Broken-Auth-Assignment" debugging assignment. The original API was non-functional due to middleware errors, missing dependencies, and incorrect logic flow.

## 🐛 Bug Fix Report (What was wrong vs What I fixed)

### 1. The Hanging Logger

- **The Bug:** The `requestLogger` middleware logged the request but never passed control to the next function.
- **The Fix:** Added `next()` at the end of the function in `middleware/logger.js`.

### 2. Missing Cookies

- **The Bug:** The server was trying to set and read cookies, but the `cookie-parser` middleware was imported but never used.
- **The Fix:** Added `app.use(cookieParser())` in `server.js`.

### 3. Infinite Loading on Protected Routes

- **The Bug:** The `authMiddleware` successfully verified the JWT token but hung indefinitely because it didn't pass control.
- **The Fix:** Added `next()` inside the success block of `middleware/auth.js`.

### 4. Broken Token Exchange

- **The Bug:** The `/auth/token` endpoint was looking for the session ID in `req.headers.authorization` (which contained the Bearer token), but the client was sending the session ID in a HTTP-Only cookie.
- **The Fix:** Updated the logic to read the session ID from `req.cookies.session_token`.

### 5. Invisible OTP

- **The Bug:** The OTP was generated but not logged to the console, making it impossible to know the code to verify.
- **The Fix:** Updated the `console.log` in `/auth/login` to print the OTP.

---

## Real-World Improvements (Architecture & Best Practices)

If we were to deploy this API to a production environment, the following architectural changes would be necessary to ensure security and scalability.

### 1. Database Integration (Persistence)

**Current State:** The app uses in-memory objects (`loginSessions = {}`) to store user sessions.
**Problem:** If the server restarts (updates or crashes), all users are instantly logged out and data is lost. This also prevents scaling across multiple servers.
**The Fix:** Connect a database like **Redis** (for short-lived sessions/OTPs) or **MongoDB/PostgreSQL** (for user data).

- _Code Change:_ Replace `loginSessions[id] = ...` with `await db.collection('sessions').insertOne(...)`.

### 2. Secure Token Generation

**Current State:** The app uses `Math.random()` to generate Session IDs.
**Problem:** `Math.random()` is not cryptographically secure and can be predicted by attackers, leading to session hijacking.
**The Fix:** We should utilize the `utils/tokenGenerator.js` file provided in the project (after fixing its try/catch bug).

- _Why:_ It uses `crypto.createHmac`, which generates unguessable, secure strings.
- _Implementation:_

  ```javascript
  // In server.js
  const { generateToken } = require("./utils/tokenGenerator");

  // Inside /auth/login
  // OLD: const loginSessionId = Math.random().toString(36)...
  // NEW:
  const loginSessionId = await generateToken(email);
  ```

### 3. Environment Variables

**Current State:** Fallback strings like `"default-secret-key"` are hardcoded.
**Problem:** Hardcoding secrets is a major security risk.
**The Fix:** Enforce the use of a `.env` file and remove default fallbacks in production.

- _Code Change:_ `const secret = process.env.JWT_SECRET;` (Throw an error if it's undefined).

### 4. HTTP Security Headers

**Current State:** Basic Express server.
**The Fix:** Use `helmet` middleware to set secure HTTP headers (protecting against XSS, clickjacking, etc.) and ensure `secure: true` is set for cookies when running on HTTPS.

---

## 🚀 How to Run the Fixed Code

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Server:**
    ```bash
    npm start
    ```

## 🧪 Testing

- **Terminal:** See `output.txt` for a successful run of all 4 cURL commands.
- **Postman:** A collection is included (`postman_collection.json`) for easy testing.

## ✅ Assignment Evidence

- Access to Protected Route: **Success**
- Flag Captured: `FLAG-c3R1ZGVudEBleGFtcGxlLmNvbV9DT01QTEVURURfQVNTSUdOTUVOVA==`
