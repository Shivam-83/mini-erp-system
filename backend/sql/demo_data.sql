-- Demo Data for Mini ERP System
-- Run this after schema is created

-- Clear existing demo data (optional)
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM journal_entry_lines WHERE journal_entry_id > 0;
DELETE FROM journal_entries WHERE id > 0;
DELETE FROM invoices WHERE id > 0;
DELETE FROM projects WHERE id > 0;
DELETE FROM customers WHERE id > 0;
DELETE FROM vendors WHERE id > 0;
SET FOREIGN_KEY_CHECKS = 1;

-- Update Chart of Accounts with realistic balances
UPDATE chart_of_accounts SET balance = 125000.00 WHERE code = '1000'; -- Cash
UPDATE chart_of_accounts SET balance = 45000.00 WHERE code = '1100'; -- A/R
UPDATE chart_of_accounts SET balance = 28000.00 WHERE code = '1200'; -- Inventory
UPDATE chart_of_accounts SET balance = 85000.00 WHERE code = '1500'; -- Equipment

UPDATE chart_of_accounts SET balance = 32000.00 WHERE code = '2000'; -- A/P
UPDATE chart_of_accounts SET balance = 15000.00 WHERE code = '2100'; -- Short-term Loans
UPDATE chart_of_accounts SET balance = 120000.00 WHERE code = '2500'; -- Long-term Debt

UPDATE chart_of_accounts SET balance = 350000.00 WHERE code = '3000'; -- Owner Equity
UPDATE chart_of_accounts SET balance = 81000.00 WHERE code = '3100'; -- Retained Earnings

UPDATE chart_of_accounts SET balance = 42000.00 WHERE code = '4000'; -- Service Revenue
UPDATE chart_of_accounts SET balance = 185000.00 WHERE code = '4100'; -- Project Revenue

UPDATE chart_of_accounts SET balance = 65000.00 WHERE code = '5000'; -- COGS
UPDATE chart_of_accounts SET balance = 48000.00 WHERE code = '5100'; -- Labor Costs

UPDATE chart_of_accounts SET balance = 12500.00 WHERE code = '6000'; -- Operating Expenses
UPDATE chart_of_accounts SET balance = 9500.00 WHERE code = '6100'; -- Administrative

-- Add demo customers
INSERT INTO customers (name, email, phone, address, city, country, tax_id, credit_limit, balance, status) VALUES
('BuildCorp Inc.', 'contact@buildcorp.com', '+1-555-0101', '123 Construction Ave', 'New York', 'USA', 'TAX-BC-001', 100000, 15000, 'active'),
('Metro Developers', 'info@metrodev.com', '+1-555-0102', '456 Business Blvd', 'Los Angeles', 'USA', 'TAX-MD-002', 150000, 22000, 'active'),
('Skyline Properties', 'contact@skyline.com', '+1-555-0103', '789 Tower St', 'Chicago', 'USA', 'TAX-SP-003', 80000, 8000, 'active'),
('GreenBuild LLC', 'hello@greenbuild.com', '+1-555-0104', '321 Eco Way', 'Seattle', 'USA', 'TAX-GB-004', 60000, 0, 'active'),
('Urban Estates', 'info@urbanestates.com', '+1-555-0105', '654 Downtown Dr', 'Boston', 'USA', 'TAX-UE-005', 120000, 0, 'active');

-- Add demo vendors
INSERT INTO vendors (name, email, phone, address, city, country, tax_id, payment_terms, balance, status) VALUES
('Steel Supply Co.', 'orders@steelsupply.com', '+1-555-0201', '100 Industrial Park', 'Pittsburgh', 'USA', 'TAX-SS-101', 'Net 30', 12000, 'active'),
('ConEquip Rentals', 'rentals@conequip.com', '+1-555-0202', '200 Equipment Rd', 'Houston', 'USA', 'TAX-CE-102', 'Net 15', 8500, 'active'),
('BuildMart Materials', 'sales@buildmart.com', '+1-555-0203', '300 Supply Lane', 'Denver', 'USA', 'TAX-BM-103', 'Net 45', 15000, 'active'),
('ProTools Wholesale', 'info@protools.com', '+1-555-0204', '400 Tool Street', 'Atlanta', 'USA', 'TAX-PT-104', 'Net 30', 5500, 'active'),
('SafetyFirst Supplies', 'contact@safetyfirst.com', '+1-555-0205', '500 Safety Blvd', 'Phoenix', 'USA', 'TAX-SF-105', 'COD', 0, 'active');

-- Add demo projects
INSERT INTO projects (id, name, description, budget, spent, progress) VALUES
(1, 'Downtown Office Complex', 'Modern 12-story office building in downtown financial district', 500000, 285000, 55),
(2, 'Residential Tower A', 'Luxury 20-floor residential tower with amenities', 800000, 420000, 48),
(3, 'Shopping Mall Renovation', 'Complete renovation of 3-level shopping center', 350000, 98000, 32),
(4, 'Green Housing Development', 'Eco-friendly residential community project', 650000, 112000, 18),
(5, 'Urban Park Infrastructure', 'Public park development with recreational facilities', 280000, 245000, 92);

-- Add demo invoices
INSERT INTO invoices (project_id, description, amount, status, issued_at) VALUES
(1, 'Phase 1 - Foundation Work', 95000, 'paid', '2024-02-01'),
(1, 'Phase 2 - Structural Framework', 120000, 'paid', '2024-04-01'),
(1, 'Phase 3 - Interior Work', 70000, 'pending', '2024-11-01'),
(2, 'Initial Construction Payment', 180000, 'paid', '2024-05-01'),
(2, 'Progress Payment - Floors 1-5', 150000, 'paid', '2024-08-01'),
(2, 'Progress Payment - Floors 6-8', 90000, 'pending', '2024-11-15'),
(3, 'Demolition & Site Prep', 60000, 'paid', '2024-07-01'),
(3, 'Renovation Materials', 38000, 'pending', '2024-10-01'),
(4, 'Planning & Permits', 75000, 'paid', '2024-10-01'),
(5, 'Infrastructure Phase 1', 140000, 'paid', '2024-01-15'),
(5, 'Infrastructure Phase 2 - Final', 105000, 'paid', '2024-06-01');

-- Add sample journal entries
INSERT INTO journal_entries (id, entry_number, entry_date, description, reference, status, created_by) VALUES
(1, 'JE-2024-001', '2024-01-15', 'Initial Capital Investment', 'CAP-001', 'approved', 1),
(2, 'JE-2024-002', '2024-02-01', 'Equipment Purchase', 'EQ-001', 'approved', 1),
(3, 'JE-2024-003', '2024-03-15', 'Revenue Recognition - Project 1', 'INV-2024-001', 'approved', 1),
(4, 'JE-2024-004', '2024-11-01', 'Monthly Expense Accrual', 'EXP-NOV', 'draft', 1);

-- Journal entry lines for balanced entries
-- Entry 1: Capital Investment ($350,000)
INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description) VALUES
(1, 1, 350000, 0, 'Cash received from owner'),
(1, 8, 0, 350000, 'Owner equity contribution');

-- Entry 2: Equipment Purchase ($85,000)
INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description) VALUES
(2, 4, 85000, 0, 'New construction equipment'),
(2, 1, 0, 85000, 'Cash payment for equipment');

-- Entry 3: Revenue Recognition ($95,000)
INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description) VALUES
(3, 2, 95000, 0, 'Accounts receivable'),
(3, 11, 0, 95000, 'Project revenue earned');

-- Entry 4: Expense Accrual (Draft - $15,000)
INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description) VALUES
(4, 15, 15000, 0, 'November admin expenses'),
(4, 5, 0, 15000, 'Accounts payable accrual');
