const request = require('supertest');
const app = require('../index');
const db = require('../db');

describe('Invoice transaction and AR update', () => {
  let token;
  let projectId;

  beforeAll(async () => {
    // register and login test user (admin)
    await request(app).post('/api/auth/register').send({ name: 'Test Admin', email: 'testadmin@example.com', password: 'pass123' });
    // promote to admin directly in DB
    await db.execute("UPDATE users SET role='admin' WHERE email = ?", ['testadmin@example.com']);
    const login = await request(app).post('/api/auth/login').send({ email: 'testadmin@example.com', password: 'pass123' });
    token = login.body.token;
    // create a project (admin-only)
    const pj = await request(app).post('/api/projects').set('Authorization', `Bearer ${token}`).send({ name: 'Test Project X', budget: 10000, progress: 10 });
    projectId = pj.body.project.id;
  });

  afterAll(async () => {
    // cleanup created project and test user
    if (projectId) {
      await db.execute('DELETE FROM invoices WHERE project_id = ?', [projectId]);
      await db.execute('DELETE FROM projects WHERE id = ?', [projectId]);
    }
    await db.execute("DELETE FROM users WHERE email = 'testadmin@example.com'");
    await db.end();
  });

  test('creates invoice atomically and updates AR and project spent', async () => {
    // get initial AR and project spent
    const [[{ ar: arBefore = 0 }]] = await db.execute("SELECT IFNULL(balance,0) as ar FROM accounts WHERE name='Accounts Receivable'");
    const [projRowsBefore] = await db.execute('SELECT spent FROM projects WHERE id = ?', [projectId]);
    const spentBefore = Number(projRowsBefore[0].spent || 0);

    const invoiceAmount = 1500;
    const resp = await request(app).post('/api/invoices').set('Authorization', `Bearer ${token}`).send({ project_id: projectId, amount: invoiceAmount, description: 'Test materials' });
    expect(resp.statusCode).toBe(200);

    const [[{ ar: arAfter = 0 }]] = await db.execute("SELECT IFNULL(balance,0) as ar FROM accounts WHERE name='Accounts Receivable'");
    const [projRowsAfter] = await db.execute('SELECT spent FROM projects WHERE id = ?', [projectId]);
    const spentAfter = Number(projRowsAfter[0].spent || 0);

    expect(Number(arAfter)).toBeCloseTo(Number(arBefore) + invoiceAmount);
    expect(spentAfter).toBeCloseTo(spentBefore + invoiceAmount);
  }, 20000);
});
