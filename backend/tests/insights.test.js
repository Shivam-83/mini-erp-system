const request = require('supertest');
const app = require('../index');
const db = require('../db');

describe('Insights engine', () => {
  let token;
  let projectId;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({ name: 'Risk Tester', email: 'risk@test.com', password: 'pass123' });
    await db.execute("UPDATE users SET role='admin' WHERE email = ?", ['risk@test.com']);
    const login = await request(app).post('/api/auth/login').send({ email: 'risk@test.com', password: 'pass123' });
    token = login.body.token;
    const pj = await request(app).post('/api/projects').set('Authorization', `Bearer ${token}`).send({ name: 'Risk Project', budget: 10000, progress: 10 });
    projectId = pj.body.project.id;
    // set spent high to trigger Medium/High risk
    await db.execute('UPDATE projects SET spent = ? WHERE id = ?', [2000, projectId]);
  });

  afterAll(async () => {
    await db.execute('DELETE FROM projects WHERE id = ?', [projectId]);
    await db.execute("DELETE FROM users WHERE email = 'risk@test.com'");
    await db.end();
  });

  test('returns insight with risk level', async () => {
    const res = await request(app).get(`/api/insights/project/${projectId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('insight');
    expect(res.body.insight).toHaveProperty('level');
  });
});
