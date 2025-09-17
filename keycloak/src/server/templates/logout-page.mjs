export function createLogoutPage() {
  return `<!DOCTYPE html>
<html>
<head>
    <title>OIDC Logout</title>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            text-align: center; 
        }
        .success { 
            color: green; 
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
    </style>
</head>
<body>
    <div class="success">
        <h1>ログアウト完了</h1>
        <p>ログアウトが正常に完了しました。</p>
        <p>セッションが無効化されました。</p>
        <a href="/" class="button">再ログイン</a>
    </div>
</body>
</html>`;
}
