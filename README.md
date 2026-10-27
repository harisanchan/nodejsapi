# nodejsapi

Sample REST API built with Express, ready to deploy on cPanel hosting using **Setup Node.js App** (Phusion Passenger).

## Project structure

```
app.js                    # Entry point (cPanel "Application startup file")
src/routes/index.js       # Route definitions
src/controllers/users.js  # Sample CRUD controller (in-memory data)
src/middleware/errors.js  # 404 and error handlers
.env.example              # Environment variable template
```

## Run locally

```bash
npm install
cp .env.example .env
npm run dev        # or: npm start
```

Open http://localhost:3000

## Endpoints

| Method | Path            | Description        |
|--------|-----------------|--------------------|
| GET    | `/`             | API status         |
| GET    | `/v1/health`    | Health check       |
| GET    | `/v1/version`   | Live build version and start time |
| GET    | `/v1/users`     | List users         |
| GET    | `/v1/users/:id` | Get one user       |
| POST   | `/v1/users`     | Create (`name`, `email`) |
| PUT    | `/v1/users/:id` | Update user        |
| DELETE | `/v1/users/:id` | Delete user        |

Example:

```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","email":"ali@example.com"}'
```

## Deploy to cPanel

1. **Upload the code**
   - Zip the project **without** `node_modules` and `.env`.
   - In cPanel → **File Manager**, create a folder outside `public_html`, e.g. `/home/<user>/nodejsapi`, upload the zip and extract it.
   - (Or use cPanel → **Git Version Control** to clone this repository into that folder.)

2. **Create the Node.js app**
   - cPanel → **Setup Node.js App** → **Create Application**
   - **Node.js version**: 18 or newer
   - **Application mode**: Production
   - **Application root**: `nodejsapi`
   - **Application URL**: choose the domain/subdomain (e.g. `api.yourdomain.com`), or a sub-path such as `yourdomain.com/api`
   - **Application startup file**: `app.js`
   - Click **Create**.

3. **Environment variables** (in the same screen → *Add Variable*)
   - `NODE_ENV` = `production`
   - `BASE_PATH` = `/api` **only** if you used a sub-path Application URL and routes return 404; otherwise leave it unset.
   - Do **not** set `PORT` — Passenger assigns it automatically.

4. **Install dependencies**
   - Click **Run NPM Install** (requires `package.json` in the app root), then **Restart**.
   - Alternatively, copy the `source .../activate` command shown at the top of the page, run it in cPanel **Terminal**, then `npm install`.

5. **Test**
   ```
   https://api.yourdomain.com/v1/health
   ```

### Updating the app
Upload/pull the new code, run **NPM Install** if dependencies changed, then click **Restart** (or `touch tmp/restart.txt` in the app root).

To confirm the latest build is live, bump `version` in `package.json` before deploying (or set a `BUILD_VERSION` environment variable in cPanel), then open `/v1/version`. It should show the new version and a `startedAt` time from after your restart.

### Troubleshooting
- **503 / app won't start**: check `stderr.log` in the application root and confirm the startup file is `app.js`.
- **404 on every route under a sub-path**: set `BASE_PATH` to that sub-path and restart.
- **Data resets**: the sample users are stored in memory; connect a database (e.g. cPanel MySQL) for persistent data.
