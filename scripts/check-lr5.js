require('dotenv/config');
const jwt = require('jsonwebtoken');
const { call, show, expect, done } = require('./check');
(async () => {
  let r, body;
  const email = `student${Date.now()}@example.com`;

  body = { email, password: 'Password123', fullName: 'Тестовий Студент' };
  r = await call('POST', '/api/v1/auth/register', body); show('Реєстрація', 'POST', '/api/v1/auth/register', body, r);
  expect('201, роль USER, пароль не повертається', r.status === 201 && r.data.data.role === 'USER' && !('password' in r.data.data));

  r = await call('POST', '/api/v1/auth/register', body); show('Повторна реєстрація', 'POST', '/api/v1/auth/register', body, r);
  expect('400: email зайнятий', r.status === 400);

  body = { email: 'bad', password: '123', fullName: 'x' };
  r = await call('POST', '/api/v1/auth/register', body); show('Реєстрація з поганими даними', 'POST', '/api/v1/auth/register', body, r);
  expect('400 від Zod', r.status === 400 && r.data.errors.length === 3);

  body = { email, password: 'WrongPass1' };
  r = await call('POST', '/api/v1/auth/login', body); show('Вхід з неправильним паролем', 'POST', '/api/v1/auth/login', body, r);
  expect('401', r.status === 401);

  body = { email, password: 'Password123' };
  r = await call('POST', '/api/v1/auth/login', body); show('Вхід студента', 'POST', '/api/v1/auth/login', body, r);
  expect('200 і JWT із трьох частин', r.status === 200 && r.data.token.split('.').length === 3);
  const userToken = r.data.token;
  const payload = JSON.parse(Buffer.from(userToken.split('.')[1], 'base64url').toString());
  console.log('  payload токена:', JSON.stringify(payload));
  expect('у payload є sub, role, exp і немає пароля', payload.sub && payload.role === 'USER' && payload.exp - payload.iat === 900 && !payload.password);
  const userId = Number(payload.sub);

  r = await call('GET', '/api/v1/auth/me', null, userToken); show('Хто я (authGuard)', 'GET', '/api/v1/auth/me', null, r);
  expect('200 і дані з токена', r.status === 200 && r.data.data.id === userId);

  body = { title: 'Курс від студента', price: 100 };
  r = await call('POST', '/api/v1/courses', body); show('Створення курсу без токена', 'POST', '/api/v1/courses', body, r);
  expect('401 Unauthorized', r.status === 401);

  r = await call('POST', '/api/v1/courses', body, userToken); show('Створення курсу з роллю USER', 'POST', '/api/v1/courses', body, r);
  expect('403 Forbidden', r.status === 403);

  r = await call('POST', '/api/v1/auth/login', { email: 'teacher@example.com', password: 'Password123' });
  const managerToken = r.data.token;
  r = await call('POST', '/api/v1/courses', body, managerToken); show('Створення курсу з роллю MANAGER', 'POST', '/api/v1/courses', body, r);
  expect('403: лише ADMIN', r.status === 403);

  r = await call('POST', '/api/v1/auth/login', { email: 'admin@khntu.edu.ua', password: 'Password123' }); show('Вхід адміна', 'POST', '/api/v1/auth/login', { email: 'admin@khntu.edu.ua', password: '***' }, r);
  const adminToken = r.data.token;
  expect('200, роль ADMIN', r.status === 200 && r.data.data.user.role === 'ADMIN');

  body = { title: 'Redis для початківців', price: 750 };
  r = await call('POST', '/api/v1/courses', body, adminToken); show('Створення курсу з роллю ADMIN', 'POST', '/api/v1/courses', body, r);
  expect('201, викладач = автор запиту', r.status === 201 && r.data.data.instructorId === 2);
  const courseId = r.data.data.id;

  body = { items: [{ courseId, quantity: 1 }] };
  r = await call('POST', '/api/v1/orders', body); show('Замовлення без токена', 'POST', '/api/v1/orders', body, r);
  expect('401', r.status === 401);
  r = await call('POST', '/api/v1/orders', body, userToken); show('Замовлення студента (транзакція)', 'POST', '/api/v1/orders', body, r);
  expect('201, userId береться з токена', r.status === 201 && r.data.data.userId === userId && r.data.data.items[0].priceAtPurchase === 750);
  const orderId = r.data.data.id;

  r = await call('PATCH', `/api/v1/orders/${orderId}/status`, { status: 'PAID' }, userToken); show('USER змінює статус', 'PATCH', `/api/v1/orders/${orderId}/status`, { status: 'PAID' }, r);
  expect('403', r.status === 403);
  r = await call('PATCH', `/api/v1/orders/${orderId}/status`, { status: 'PAID' }, managerToken); show('MANAGER змінює статус', 'PATCH', `/api/v1/orders/${orderId}/status`, { status: 'PAID' }, r);
  expect('200 PAID', r.status === 200 && r.data.data.status === 'PAID');

  r = await call('DELETE', `/api/v1/courses/${courseId}`, null, userToken); show('USER видаляє курс', 'DELETE', `/api/v1/courses/${courseId}`, null, r);
  expect('403', r.status === 403);
  r = await call('DELETE', `/api/v1/courses/${courseId}`, null, adminToken); show('ADMIN видаляє курс', 'DELETE', `/api/v1/courses/${courseId}`, null, r);
  expect('200', r.status === 200);

  const expired = jwt.sign({ sub: String(userId), role: 'USER' }, process.env.JWT_SECRET, { expiresIn: -10 });
  r = await call('GET', '/api/v1/auth/me', null, expired); show('Прострочений токен', 'GET', '/api/v1/auth/me', null, r);
  expect('401', r.status === 401);
  const forged = jwt.sign({ sub: '3', role: 'ADMIN' }, 'чужий-секрет', { expiresIn: '15m' });
  r = await call('POST', '/api/v1/courses', { title: 'Підроблений', price: 1 }, forged); show('Токен, підписаний чужим секретом', 'POST', '/api/v1/courses', { title: 'Підроблений', price: 1 }, r);
  expect('401', r.status === 401);

  done();
})();
