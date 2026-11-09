const { call, show, expect, done } = require('./check');
(async () => {
  let r, body;

  r = await call('GET', '/api/v1/courses?page=1&limit=2'); show('Пагінація: сторінка 1, limit=2', 'GET', '/api/v1/courses?page=1&limit=2', null, r);
  expect('200 і не більше 2 елементів', r.status === 200 && r.data.data.items.length <= 2);
  expect('є total, totalPages, hasNextPage', r.data.data.total >= 2 && r.data.data.totalPages >= 1 && typeof r.data.data.hasNextPage === 'boolean');
  const firstPageIds = r.data.data.items.map((i) => i.id);

  r = await call('GET', '/api/v1/courses?page=2&limit=1'); show('Пагінація: сторінка 2, limit=1', 'GET', '/api/v1/courses?page=2&limit=1', null, r);
  expect('на другій сторінці інший курс', r.status === 200 && r.data.data.items.length === 1 && r.data.data.items[0].id !== firstPageIds[0]);

  r = await call('GET', '/api/v1/courses?page=0&limit=abc'); show('Невалідні параметри пагінації', 'GET', '/api/v1/courses?page=0&limit=abc', null, r);
  expect('400 Bad Request', r.status === 400);

  body = { title: 'ab', price: -5, instructorId: 1 };
  r = await call('POST', '/api/v1/courses', body); show('validateBody: некоректний курс', 'POST', '/api/v1/courses', body, r);
  expect('400 і перелік помилок по полях', r.status === 400 && r.data.errors.length === 2);

  body = { title: 'Docker для початківців', description: 'Контейнери з нуля', price: 900, instructorId: 1 };
  r = await call('POST', '/api/v1/courses', body); show('validateBody: коректний курс', 'POST', '/api/v1/courses', body, r);
  expect('201 Created', r.status === 201 && r.data.data.id > 0);
  const newCourse = r.data.data.id;

  const got = await call('GET', '/api/v1/courses/' + newCourse);
  expect('курс читається за id', got.status === 200 && got.data.data.title === body.title);

  // Транзакція: користувач 3 це Іван із seed. Другий курс не існує, тому всі кроки мають відкотитися
  body = { userId: 3, items: [{ courseId: newCourse }, { courseId: 99999 }] };
  r = await call('POST', '/api/v1/orders', body); show('Транзакція: другий курс не існує, відкат', 'POST', '/api/v1/orders', body, r);
  expect('404 і замовлення не створене', r.status === 404);

  body = { userId: 3, items: [{ courseId: newCourse, quantity: 1 }] };
  r = await call('POST', '/api/v1/orders', body); show('Транзакція: успішне замовлення', 'POST', '/api/v1/orders', body, r);
  expect('201, є items з priceAtPurchase', r.status === 201 && r.data.data.items[0].priceAtPurchase === 900 && r.data.data.totalAmount === 900);
  const orderId = r.data.data.id;

  r = await call('POST', '/api/v1/orders', body); show('Повторне замовлення того ж курсу', 'POST', '/api/v1/orders', body, r);
  expect('409 Conflict, а 201 вище доводить, що відкат не залишив запису на курс', r.status === 409);

  body = { userId: 3, items: [] };
  r = await call('POST', '/api/v1/orders', body); show('Порожнє замовлення', 'POST', '/api/v1/orders', body, r);
  expect('400 Bad Request', r.status === 400);

  r = await call('PATCH', `/api/v1/orders/${orderId}/status`, { status: 'CANCELLED' }); show('Автомат станів: PENDING -> CANCELLED', 'PATCH', `/api/v1/orders/${orderId}/status`, { status: 'CANCELLED' }, r);
  expect('200', r.status === 200 && r.data.data.status === 'CANCELLED');
  r = await call('PATCH', `/api/v1/orders/${orderId}/status`, { status: 'PAID' }); show('Автомат станів: CANCELLED -> PAID заборонено', 'PATCH', `/api/v1/orders/${orderId}/status`, { status: 'PAID' }, r);
  expect('409', r.status === 409);

  done();
})();
