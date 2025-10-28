# Task Control Platform

Микросервисная платформа для управления задачами строительных объектов. Проект включает API-шлюз и два сервиса (пользователи и заказы) с едиными стандартами логирования, трассировки и аутентификации.

## Структура

- `api_gateway` – шлюз, проксирует запросы на сервисы, проверяет JWT, ограничивает частоту запросов.
- `service_users` – регистрация, аутентификация, профиль и список пользователей.
- `service_orders` – создание и жизненный цикл заказов, события домена.
- `packages/shared` – общие утилиты: конфиг, логирование, middlewares, схемы валидации, JWT, публикация событий.
- `docs/openapi.yaml` – спецификация API.
- `docker/` – окружения dev/test/prod с переменными.

## Запуск локально (Node.js)

```bash
npm install

# запуск сервисов по отдельности
npm run dev        # шлюз на 3000
npm run dev:users  # сервис пользователей на 3001
npm run dev:orders # сервис заказов на 3002

# тесты и линт
npm run lint
npm run test
```

Перед запуском можно создать `.env` на основе `docker/dev/*.env` (jwt секрет, e-mail админа и т.д.).

## Запуск в Docker

```bash
# окружение разработки
npm run start:dev

# окружение теста (порты 4000+)
npm run start:test

# окружение продакшн (порты 80/8081/8082)
npm run start:prod

# остановить контейнеры
npm run stop
```

По умолчанию создаётся пользователь-админ (email и пароль берутся из переменных ENV). Для demo-режима: `admin@example.com` / `Admin1234!`.

## Маршруты (через API Gateway)

- `POST /v1/users/register` – регистрация.
- `POST /v1/users/login` – вход (возврат JWT).
- `GET /v1/users/me` / `PATCH /v1/users/me` – профиль.
- `GET /v1/users` – список пользователей (роль admin).
- `POST /v1/orders` – создать заказ.
- `GET /v1/orders` – список своих заказов.
- `GET /v1/orders/:id` – получить заказ.
- `PATCH /v1/orders/:id/status` – обновить статус (менеджер или владелец).
- `DELETE /v1/orders/:id` – отмена заказа.

Ответы следуют формату `{ success, data | error }`, ошибки включают `code`, `message`, `requestId`.

## Наблюдаемость

- Логи через `pino`, логгер привязывает `x-request-id` и контекст пользователя.
- `traceMiddleware` выставляет `x-trace-id`/`x-span-id` для трассировок.
- Rate limit ограничивает всплески (100 req/мин).

## Тестирование

- Юнит и интеграционные тесты на Jest/Supertest (`tests/`).
- Покрытие: регистрация, логин, создание заказов, health API.

## Спецификация API

OpenAPI 3.1 – файл `docs/openapi.yaml`. Можно импортировать в Swagger UI или Postman.

## Дополнительно

- Dockerfile для каждого сервиса с multi-stage сборкой.
- Настроенный `docker-compose.yml` и env-профили для dev/test/prod.
- Возможность легко заменить in-memory хранилище на БД (подготовлены слои).

