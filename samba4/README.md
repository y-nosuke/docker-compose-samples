# samba4

これはsamba4の Docker-Compose です。

## 事前準備

hostsファイルに`dc1.localhost`を登録します。

```bash
# Windows
# C:\Windows\System32\drivers\etc\hosts
127.0.0.1 dc1.localhost
```

## 学習計画

| フェーズ    | 目的                                           |
| ----------- | ---------------------------------------------- |
| **Phase 1** | Samba4 AD ドメイン構築（Docker Compose）       |
| **Phase 2** | Windows Server VM のドメイン参加と基本操作     |
| **Phase 3** | LDAP / Kerberos の動作確認と理解               |
| **Phase 4** | FreeIPA 導入と Samba4 との相互運用（トラスト） |
| **Phase 5** | Keycloak を導入し、LDAP連携＋OIDC認証統合      |
| **Phase 6** | バックアップ・監視・トラブルシュート演習       |

## 動作確認

### コマンド

```sh
ldapsearch -x -H ldap://dc1.localhost -b "dc=example,dc=local" -D "Administrator@example.local" -w 'Passw0rd!'
```

## 参考

- [LinuxCrafts/samba-ad-dc](https://github.com/LinuxCrafts/samba-ad-dc)
