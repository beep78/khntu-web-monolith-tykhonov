# khntu-web-monolith-tykhonov

Лабораторна робота №1 з дисципліни «Технологія розробки Інтернет-застосунків» (ХНТУ).
Студент: Тихонов Вадим.

Тема: початкова архітектура проєкту, ER-діаграма сутностей та налаштування HTTP-сервера.

## Предметна область: платформа онлайн-курсів

Система дозволяє викладачам публікувати курси, згруповані за категоріями, а студентам — записуватися на них,
відстежувати прогрес навчання та залишати відгуки.

| Сутність     | Призначення                                                                    |
| ------------ | ------------------------------------------------------------------------------ |
| `USER`       | Користувач системи (студент або викладач), поле `role` визначає роль          |
| `CATEGORY`   | Категорія курсів (наприклад, «Програмування», «Дизайн»)                        |
| `COURSE`     | Курс; належить одній категорії та одному викладачу                             |
| `ENROLLMENT` | Проміжна сутність зв'язку N:M «користувач — курс» із власними атрибутами       |
| `REVIEW`     | Відгук користувача про курс (оцінка та коментар)                               |

Зв'язки:

- `CATEGORY` 1:N `COURSE`; `USER` (викладач) 1:N `COURSE`;
- `USER` N:M `COURSE` через `ENROLLMENT` (атрибути: `enrolledAt`, `progressPercent`, `status`);
- `COURSE` 1:N `REVIEW`; `USER` 1:N `REVIEW`.

## ER-діаграма

```mermaid
erDiagram
    USER ||--o{ ENROLLMENT : enrolls
    COURSE ||--o{ ENROLLMENT : has
    CATEGORY ||--o{ COURSE : groups
    USER ||--o{ COURSE : teaches
    COURSE ||--o{ REVIEW : receives
    USER ||--o{ REVIEW : writes

    USER {
        int id PK
        string email
        string fullName
        string role
    }
    CATEGORY {
        int id PK
        string name
    }
    COURSE {
        int id PK
        int categoryId FK
        int instructorId FK
        string title
        float price
    }
    ENROLLMENT {
        int id PK
        int userId FK
        int courseId FK
        datetime enrolledAt
        int progressPercent
        string status
    }
    REVIEW {
        int id PK
        int userId FK
        int courseId FK
        int rating
        string comment
    }
```

## Запуск

```bash
npm install
cp .env.example .env     # на Windows: copy .env.example .env
npm run dev
```

Перевірка: `GET http://localhost:3000/api/v1/health`

```json
{
  "status": "OK",
  "uptime": 3.14,
  "timestamp": "2026-10-27T01:00:00.000Z",
  "nodeVersion": "v22.x.x",
  "memoryUsage": { "rss": 0, "heapTotal": 0, "heapUsed": 0, "external": 0, "arrayBuffers": 0 }
}
```

## REST API (ЛР2, MILESTONE 1)

Дані зберігаються у пам'яті (мок-масиви у шарі `services`), БД не використовується.

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/api/v1/health` | стан сервера |
| GET | `/api/v1/courses` | список курсів |
| GET | `/api/v1/courses/:id` | курс за id (404, якщо не знайдено) |
| GET | `/api/v1/categories` | список категорій |
| GET | `/api/v1/categories/:id` | категорія за id (404, якщо не знайдено) |

Успішна відповідь: `{ "status": "success", "data": ... }`.
Помилка: `{ "status": "error", "statusCode": 404, "message": "Курс не знайдено" }`.

Postman-колекція: `postman_collection_milestone1.json`.

## Структура

```
src/
├── app.ts                       # Express: middleware, маршрути, errorHandler
├── server.ts                    # запуск HTTP-слухача на порту з .env
├── routes/                      # course.routes.ts, category.routes.ts
├── controllers/                 # HTTP-шар: course.controller.ts, category.controller.ts
├── services/                    # бізнес-логіка + мок-дані
├── middlewares/                 # logger.middleware.ts, error.middleware.ts
└── utils/                       # AppError.ts, catchAsync.ts
```

Потік запиту: `routes -> controllers -> services`; помилки (`AppError`) потрапляють у глобальний `errorHandler`.
У межах ЛР1–ЛР2 не використовуються ORM, база даних та бібліотеки валідації/автентифікації (за умовами «стоп-лінії»).
