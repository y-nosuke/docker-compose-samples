export function createHomePage() {
  return `<!DOCTYPE html>
<html>
<head>
    <title>OIDC Test Server</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>OIDC認証テストサーバー</h1>
    <p>このサーバーはOIDC認証のテスト用です。</p>
    
    <h2>利用可能なエンドポイント:</h2>
    <ul>
        <li><a href="/callback">/callback</a> - 認証コールバック</li>
        <li><a href="/logout">/logout</a> - ログアウトコールバック</li>
    </ul>
    
    <h2>テスト用URL:</h2>
    <p>以下のボタンをクリックして認証URLを生成し、ブラウザで開いてください。</p>
    <button onclick="generateAuthUrl()">認証URLを生成して開く</button>
    <div id="authUrl" style="margin-top: 10px; word-break: break-all;"></div>
    
    <script>
        async function generateAuthUrl() { 
            try {
                // サーバー側で認証URLを生成（PKCEパラメータとセッション管理を含む）
                const response = await fetch('/auth-url');
                const data = await response.json();
                
                if (data.success) {
                    const authUrl = data.authUrl;
                    document.getElementById('authUrl').innerHTML = 
                        '<p><strong>生成された認証URL:</strong></p>' +
                        '<a href="' + authUrl + '" target="_blank" style="word-break: break-all;">' + authUrl + '</a>' +
                        '<p><small>State: ' + data.state + '</small></p>';
                    
                    // 新しいタブで認証URLを開く
                    window.open(authUrl, '_blank');
                } else {
                    document.getElementById('authUrl').innerHTML = 
                        '<p style="color: red;"><strong>エラー:</strong> ' + data.error + '</p>';
                    console.error('認証URL生成エラー:', data);
                }
            } catch (error) {
                document.getElementById('authUrl').innerHTML = 
                    '<p style="color: red;"><strong>ネットワークエラー:</strong> サーバーとの通信に失敗しました</p>';
                console.error('ネットワークエラー:', error);
            }
        }
    </script>
</body>
</html>`;
}
