// Cloudflare Pages Functions for Next.js App
// This file should be at: functions/_middleware.js

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // For root path, return Login page HTML
  if (url.pathname === '/' || url.pathname === '') {
    return new Response(getHTML(), {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  }

  // Let Next.js handle other routes
  return next();
}

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K Energy Save</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #0b1220 100%);
            position: relative;
            padding: 32px;
        }
        .overlay {
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at center, rgba(255,255,255,0.03), rgba(0,0,0,0.5));
            pointer-events: none;
        }
        .card {
            width: 100%;
            max-width: 520px;
            background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012));
            border: 1px solid rgba(255, 254, 255, 0.4);
            border-radius: 14px;
            padding: 32px;
            position: relative;
            box-shadow: 0 12px 30px rgba(2,6,23,0.72), 0 2px 8px rgba(124,58,237,0.08);
            color: #e6eefb;
        }
        h1 {
            text-align: center;
            margin-bottom: 18px;
            font-size: 28px;
        }
        .form {
            display: grid;
            gap: 12px;
        }
        label {
            display: block;
            font-size: 14px;
            color: #cbd5e1;
        }
        input {
            width: 100%;
            margin-top: 8px;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid rgba(250, 248, 253, 0.48);
            background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02));
            color: #fff;
            font-size: 15px;
            box-shadow: inset 0 3px 8px rgba(0,0,0,0.45);
        }
        button {
            margin-top: 10px;
            padding: 12px 16px;
            border-radius: 10px;
            border: none;
            background: linear-gradient(90deg,#1e40af 0%, #7c3aed 100%);
            color: #fff;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 28px rgba(2,6,23,0.7);
        }
        button:hover {
            transform: translateY(-1px);
        }
        .error {
            color: #fecaca;
            background: rgba(254, 226, 226, 0.04);
            padding: 8px 10px;
            border-radius: 8px;
            font-size: 13px;
            display: none;
        }
        footer {
            margin-top: 18px;
            text-align: center;
            color: #9ca3af;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="overlay"></div>
    <main class="card">
        <h1>K Energy Save</h1>

        <form class="form" id="loginForm">
            <label>
                Username
                <input type="text" name="username" required autocomplete="username">
            </label>

            <label>
                Password
                <input type="password" name="password" required autocomplete="current-password">
            </label>

            <div class="error" id="error"></div>

            <button type="submit">Sign in</button>
        </form>

        <footer>
            <small>K Energy Save co., Ltd • ${new Date().getFullYear()}</small>
        </footer>
    </main>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const username = formData.get('username');
            const password = formData.get('password');
            const errorEl = document.getElementById('error');

            try {
                const res = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (!res.ok) {
                    throw new Error('Invalid credentials');
                }

                const data = await res.json();
                if (data && data.token) {
                    localStorage.setItem('k_system_admin_token', data.token);
                    window.location.href = '/admin/main';
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (err) {
                errorEl.textContent = err.message || 'Login failed';
                errorEl.style.display = 'block';
            }
        });
    </script>
</body>
</html>`;
}
