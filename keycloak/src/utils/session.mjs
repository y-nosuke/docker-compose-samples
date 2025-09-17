// 簡易セッション管理（学習用）
const sessions = new Map();

// セッション保存
export function saveSession(sessionKey, data) {
  sessions.set(sessionKey, data);
  console.log("セッション保存:", sessionKey);
}

// セッション取得
export function getSession(sessionKey) {
  const data = sessions.get(sessionKey);
  return data;
}

// セッション削除
export function deleteSession(sessionKey) {
  sessions.delete(sessionKey);
  console.log("セッション削除:", sessionKey);
}

// セッション一覧取得（デバッグ用）
export function getAllSessions() {
  console.log("全セッション一覧 - 件数:", sessions.size);
  return Array.from(sessions.entries());
}

// セッションクリーンアップ（古いセッションを削除）
export function cleanupExpiredSessions(maxAgeMs = 30 * 60 * 1000) {
  // 30分以上古いセッションを削除
  const now = Date.now();
  let deletedCount = 0;

  for (const [key, value] of sessions.entries()) {
    if (value.timestamp && now - value.timestamp > maxAgeMs) {
      sessions.delete(key);
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    console.log(
      "セッションクリーンアップ - 削除:",
      deletedCount,
      "残り:",
      sessions.size
    );
  }

  return deletedCount;
}

// 定期的なクリーンアップを開始
export function startSessionCleanup(intervalMs = 10 * 60 * 1000) {
  // 10分ごとにクリーンアップ実行
  setInterval(() => {
    cleanupExpiredSessions();
  }, intervalMs);

  console.log("セッションクリーンアップ開始 - 間隔:", intervalMs / 1000, "秒");
}
