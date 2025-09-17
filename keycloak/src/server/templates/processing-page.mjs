// 処理中ページ（コールバック用）
export function createProcessingPage(userSessionKey = null) {
  const redirectScript = userSessionKey
    ? `<script>
      // 3秒後にユーザーページにリダイレクト
      setTimeout(() => {
        window.location.href = '/user?session=${userSessionKey}';
      }, 3000);
    </script>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
    <title>認証処理中...</title>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            text-align: center;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 50px auto;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .processing {
            color: #007bff;
            font-size: 18px;
        }
        .success {
            color: #28a745;
            font-size: 18px;
        }
        .redirect-info {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
    ${userSessionKey ? "" : '<meta http-equiv="refresh" content="3">'}
    ${redirectScript}
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <div class="${userSessionKey ? "success" : "processing"}">
            <h2>${userSessionKey ? "✅ 認証完了！" : "🔄 認証処理中..."}</h2>
            ${
              userSessionKey
                ? `<div class="redirect-info">
                <p><strong>OIDC認証が正常に完了しました！</strong></p>
                <p>トークンの取得とユーザー情報の解析が成功しました。</p>
                <p>3秒後に自動的にユーザーページにリダイレクトします...</p>
                <p><small>手動で移動する場合は<a href="/user?session=${userSessionKey}">こちら</a>をクリック</small></p>
              </div>`
                : `<p>OIDC認証コードを処理しています。</p>
              <p>トークンを取得中です。しばらくお待ちください...</p>
              <p><small>この画面は自動的に更新されます</small></p>`
            }
        </div>
    </div>
</body>
</html>`;
}
