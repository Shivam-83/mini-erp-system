const db = require('../db');

async function getDashboard(req, res, next) {
  try {
    // totals: revenue = sum of invoice amounts, invoiceCount, accounts receivable balance
    const [[{ revenue = 0 }]] = await db.execute('SELECT IFNULL(SUM(amount),0) as revenue FROM invoices');
    const [[{ invoiceCount = 0 }]] = await db.execute('SELECT COUNT(*) as invoiceCount FROM invoices');
    const [[{ ar = 0 }]] = await db.execute("SELECT IFNULL(balance,0) as ar FROM chart_of_accounts WHERE code='1100'");
    // risk: average of project risks (simplified)
    const [projects] = await db.execute('SELECT id, budget, spent, progress FROM projects');
    let totalRiskScore = 0;
    if (projects.length) {
      projects.forEach(p => {
        const spentPct = p.budget > 0 ? (p.spent / p.budget) * 100 : 0;
        const prog = Number(p.progress || 0);
        if (spentPct > prog + 35) totalRiskScore += 100;
        else if (spentPct > prog + 20) totalRiskScore += 75;
        else if (spentPct > prog + 10) totalRiskScore += 50;
        else totalRiskScore += 20;
      });
      totalRiskScore = Math.round(totalRiskScore / projects.length);
    }
    res.json({ revenue, invoiceCount, accountsReceivable: ar, riskScore: totalRiskScore });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };