const { startDB, stopDB, clearDB, buildApp, request, auth } = require('./setup');

let app;

beforeAll(async () => {
  await startDB();
  app = buildApp();
});
afterAll(stopDB);
beforeEach(clearDB);

describe('Auth', () => {
  test('POST /api/auth/register creates a patient user and returns a JWT', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane',
      email: 'jane@example.com',
      password: 'password123',
      role: 'patient',
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.role).toBe('patient');
    expect(res.body.email).toBe('jane@example.com');
  });

  test('POST /api/auth/register rejects role=admin', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Hacker',
      email: 'hacker@example.com',
      password: 'password123',
      role: 'admin',
    });
    expect(res.status).toBe(403);
  });

  test('POST /api/auth/register rejects missing password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'NoPass',
      email: 'nopass@example.com',
    });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register rejects duplicate email', async () => {
    const body = { name: 'A', email: 'dup@example.com', password: 'password123' };
    await request(app).post('/api/auth/register').send(body);
    const res = await request(app).post('/api/auth/register').send(body);
    expect(res.status).toBe(409);
  });

  test('POST /api/auth/login succeeds with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Lo', email: 'lo@example.com', password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'lo@example.com', password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  test('POST /api/auth/login fails with wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Lo', email: 'lo@example.com', password: 'password123',
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'lo@example.com', password: 'wrong',
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/admin-login creates an admin on first login', async () => {
    const res = await request(app).post('/api/auth/admin-login').send({
      email: 'admin@example.com',
      password: process.env.ADMIN_SECRET,
    });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('admin');
    expect(res.body.token).toEqual(expect.any(String));
  });

  test('POST /api/auth/admin-login rejects wrong secret', async () => {
    const res = await request(app).post('/api/auth/admin-login').send({
      email: 'admin@example.com', password: 'wrong',
    });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me requires auth', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me returns the current user with a valid token', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Me', email: 'me@example.com', password: 'password123',
    });
    const res = await request(app).get('/api/auth/me').set(auth(reg.body.token));
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('me@example.com');
  });
});
