const db = require('../db');

async function getBalanceSheet(req, res, next) {
  try {
    const [assets] = await db.execute(`
      SELECT code, name, balance FROM chart_of_accounts 
      WHERE type = 'asset' AND is_active = TRUE 
      ORDER BY code
    `);
    
    const [liabilities] = await db.execute(`
      SELECT code, name, balance FROM chart_of_accounts 
      WHERE type = 'liability' AND is_active = TRUE 
      ORDER BY code
    `);
    
    const [equity] = await db.execute(`
      SELECT code, name, balance FROM chart_of_accounts 
      WHERE type = 'equity' AND is_active = TRUE 
      ORDER BY code
    `);
    
    const totalAssets = assets.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const totalEquity = equity.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    
    res.json({
      balance_sheet: {
        assets: { accounts: assets, total: totalAssets },
        liabilities: { accounts: liabilities, total: totalLiabilities },
        equity: { accounts: equity, total: totalEquity },
        date: new Date().toISOString().split('T')[0]
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getProfitLoss(req, res, next) {
  try {
    const { start_date, end_date } = req.query;
    
    const [revenue] = await db.execute(`
      SELECT code, name, balance FROM chart_of_accounts 
      WHERE type = 'revenue' AND is_active = TRUE 
      ORDER BY code
    `);
    
    const [expenses] = await db.execute(`
      SELECT code, name, balance FROM chart_of_accounts 
      WHERE type = 'expense' AND is_active = TRUE 
      ORDER BY code
    `);
    
    const totalRevenue = revenue.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const totalExpenses = expenses.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const netIncome = totalRevenue - totalExpenses;
    
    res.json({
      profit_loss: {
        revenue: { accounts: revenue, total: totalRevenue },
        expenses: { accounts: expenses, total: totalExpenses },
        net_income: netIncome,
        period: { start: start_date, end: end_date }
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getCashFlow(req, res, next) {
  try {
    const [cashAccountResult] = await db.execute(`
      SELECT balance FROM chart_of_accounts 
      WHERE code = '1000' AND is_active = TRUE
    `);
    
    const cashAccount = cashAccountResult[0];
    
    // Simplified cash flow - in production, would track cash movements
    const [recentInvoices] = await db.execute(`
      SELECT SUM(amount) as cash_in 
      FROM invoices 
      WHERE status = 'paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);
    
    const [recentExpenses] = await db.execute(`
      SELECT SUM(amount) as cash_out 
      FROM invoices 
      WHERE status = 'paid' AND project_id IS NULL AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);
    
    const openingBalance = parseFloat(cashAccount?.balance || 0);
    const cashIn = parseFloat(recentInvoices[0]?.cash_in || 0);
    const cashOut = parseFloat(recentExpenses[0]?.cash_out || 0);
    
    res.json({
      cash_flow: {
        opening_balance: openingBalance,
        cash_inflow: cashIn,
        cash_outflow: cashOut,
        closing_balance: openingBalance + cashIn - cashOut,
        period: 'Last 30 days'
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBalanceSheet, getProfitLoss, getCashFlow };
