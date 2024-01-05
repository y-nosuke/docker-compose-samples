# supabase

これはSupabaseの Docker-Compose です。

```sh
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
cp .env.example .env
docker compose pull
docker compose up -d
docker compose ps
```

## 管理画面

- [管理画面](http://localhost:8000/) supabase/this_password_is_insecure_and_should_be_updated

## 参考

- [Self-Hosting with Docker](https://supabase.com/docs/guides/self-hosting/docker)
