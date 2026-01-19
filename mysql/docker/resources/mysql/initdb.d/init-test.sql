SET NAMES utf8mb4;

-- テスト用データベース作成
CREATE DATABASE IF NOT EXISTS test DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 作成したデータベースを使用
USE test;

-- ユーザーテーブル作成
CREATE TABLE users
(
    id         INTEGER     NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    age        INTEGER     NOT NULL,
    created    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ユーザーデータの登録
INSERT INTO users (first_name, last_name, age) VALUES
    ("りな", "みかみ", 43),
    ("じゅん", "くさの", 34),
    ("ひでき", "やまだ", 23);
