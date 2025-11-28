// ユーザーページ（認証後のメインページ）
export function createUserPage(userInfo, tokens) {
  return `<!DOCTYPE html>
<html>
<head>
    <title>ユーザーページ - OIDC認証済み</title>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 800px;
        }
        .success { 
            color: green; 
            border: 1px solid #d4edda;
            background-color: #d1ecf1;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .user-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .token-info {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
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
    <div class="container">
        <div class="success">
            <h1>🎉 OIDC認証成功！</h1>
            <p>ログインが完了し、ユーザーページに正常にリダイレクトされました。</p>
        </div>
        
        <h2>👤 ユーザー情報</h2>
        <div class="user-info">
            <p><strong>ユーザーID:</strong> ${userInfo?.sub || "N/A"}</p>
            <p><strong>名前:</strong> ${
              userInfo?.name || userInfo?.preferred_username || "N/A"
            }</p>
            <p><strong>メールアドレス:</strong> ${userInfo?.email || "N/A"}</p>
            <p><strong>メール確認済み:</strong> ${
              userInfo?.email_verified ? "はい" : "いいえ"
            }</p>
            <p><strong>発行者:</strong> ${userInfo?.iss || "N/A"}</p>
            <p><strong>発行日時:</strong> ${
              userInfo?.iat
                ? new Date(userInfo.iat * 1000).toLocaleString("ja-JP")
                : "N/A"
            }</p>
        </div>
        
        <h2>🔑 トークン情報（学習用）</h2>
        <div class="token-info">
            <p><strong>アクセストークン:</strong></p>
            <p>${
              tokens?.access_token
                ? tokens.access_token.substring(0, 50) + "..."
                : "N/A"
            }</p>
            <br>
            <p><strong>IDトークン:</strong></p>
            <p>${
              tokens?.id_token
                ? tokens.id_token.substring(0, 50) + "..."
                : "N/A"
            }</p>
            <br>
            <p><strong>リフレッシュトークン:</strong></p>
            <p>${
              tokens?.refresh_token
                ? tokens.refresh_token.substring(0, 50) + "..."
                : "N/A"
            }</p>
            <br>
            <p><strong>トークンタイプ:</strong> ${
              tokens?.token_type || "N/A"
            }</p>
            <p><strong>有効期限:</strong> ${
              tokens?.expires_in ? tokens.expires_in + "秒" : "N/A"
            }</p>
        </div>
        
        <h2>🎯 アクション</h2>
        <button onclick="logout()" class="button logout-btn">ログアウト</button>
        <a href="/" class="button">ホームに戻る</a>
    </div>
    
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
