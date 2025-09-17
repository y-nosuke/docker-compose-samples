export function createCallbackPage(code, state, error, req) {
  return `<!DOCTYPE html>
<html>
<head>
    <title>OIDC Callback</title>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
        }
        .success { 
            color: green; 
        }
        .error { 
            color: red; 
        }
        .button { 
            background-color: #007bff; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 10px 5px; 
            text-decoration: none; 
            display: inline-block; 
        }
        .button:hover { 
            background-color: #0056b3; 
        }
        .logout-btn { 
            background-color: #dc3545; 
        }
        .logout-btn:hover { 
            background-color: #c82333; 
        }
    </style>
</head>
<body>
    <h1>OIDC認証結果</h1>
    ${
      error
        ? `<div class="error">
            <h2>認証エラー</h2>
            <p><strong>エラー:</strong> ${error}</p>
            <p><strong>URL:</strong> ${req.url}</p>
            <a href="/" class="button">再ログイン</a>
        </div>`
        : `<div class="success">
            <h2>認証成功！</h2>
            <p><strong>認証コード:</strong> ${code || "なし"}</p>
            <p><strong>State:</strong> ${state || "なし"}</p>
            <p>ログインが完了しました。以下のボタンでログアウトできます。</p>
            <button onclick="logout()" class="button logout-btn">ログアウト</button>
            <a href="/" class="button">ホームに戻る</a>
        </div>`
    }
    <script>
        function logout() { 
            const baseUrl = 'http://keycloak.localhost/realms/app-realm/protocol/openid-connect/logout'; 
            const params = new URLSearchParams({ 
                client_id: 'test-server', 
                post_logout_redirect_uri: 'http://localhost:3000/logout' 
            }); 
            const logoutUrl = baseUrl + '?' + params.toString(); 
            window.location.href = logoutUrl; 
        }
    </script>
</body>
</html>`;
}
