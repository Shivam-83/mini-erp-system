-- Insert Default Chart of Accounts

-- Assets
INSERT INTO chart_of_accounts (code, name, type, category, balance) VALUES
('1000', 'Cash and Cash Equivalents', 'asset', 'Current Assets', 0),
('1100', 'Accounts Receivable', 'asset', 'Current Assets', 0),
('1200', 'Inventory', 'asset', 'Current Assets', 0),
('1500', 'Fixed Assets', 'asset', 'Non-Current Assets', 0),
('1510', 'Equipment', 'asset', 'Non-Current Assets', 0),
('1520', 'Vehicles', 'asset', 'Non-Current Assets', 0);

-- Liabilities
INSERT INTO chart_of_accounts (code, name, type, category, balance) VALUES
('2000', 'Accounts Payable', 'liability', 'Current Liabilities', 0),
('2100', 'Short-term Loans', 'liability', 'Current Liabilities', 0),
('2500', 'Long-term Debt', 'liability', 'Non-Current Liabilities', 0);

-- Equity
INSERT INTO chart_of_accounts (code, name, type, category, balance) VALUES
('3000', 'Owner Equity', 'equity', 'Capital', 0),
('3100', 'Retained Earnings', 'equity', 'Earnings', 0);

-- Revenue
INSERT INTO chart_of_accounts (code, name, type, category, balance) VALUES
('4000', 'Project Revenue', 'revenue', 'Operating Revenue', 0),
('4100', 'Service Revenue', 'revenue', 'Operating Revenue', 0),
('4200', 'Other Income', 'revenue', 'Non-Operating Revenue', 0);

-- Expenses
INSERT INTO chart_of_accounts (code, name, type, category, balance) VALUES
('5000', 'Material Costs', 'expense', 'Cost of Goods Sold', 0),
('5100', 'Labor Costs', 'expense', 'Cost of Goods Sold', 0),
('5200', 'Equipment Rental', 'expense', 'Operating Expenses', 0),
('5300', 'Utilities', 'expense', 'Operating Expenses', 0),
('5400', 'Insurance', 'expense', 'Operating Expenses', 0),
('5500', 'Administrative Expenses', 'expense', 'Operating Expenses', 0),
('5600', 'Marketing', 'expense', 'Operating Expenses', 0);
