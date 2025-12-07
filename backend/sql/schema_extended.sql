-- Extended schema for full ERP compliance
USE `mini_erp`;

-- Roles and Permissions
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `address` TEXT,
  `city` VARCHAR(100),
  `country` VARCHAR(100),
  `tax_id` VARCHAR(50),
  `credit_limit` DECIMAL(14,2) DEFAULT 0,
  `balance` DECIMAL(14,2) DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vendors
CREATE TABLE IF NOT EXISTS `vendors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `address` TEXT,
  `city` VARCHAR(100),
  `country` VARCHAR(100),
  `tax_id` VARCHAR(50),
  `payment_terms` VARCHAR(50),
  `balance` DECIMAL(14,2) DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enhanced Accounts (Chart of Accounts)
CREATE TABLE IF NOT EXISTS `chart_of_accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('asset','liability','equity','revenue','expense') NOT NULL,
  `category` VARCHAR(100),
  `parent_id` INT NULL,
  `balance` DECIMAL(18,2) DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES chart_of_accounts(id) ON DELETE SET NULL
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS `journal_entries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `entry_number` VARCHAR(50) NOT NULL UNIQUE,
  `entry_date` DATE NOT NULL,
  `description` TEXT,
  `reference` VARCHAR(100),
  `status` ENUM('draft','posted','approved','cancelled') DEFAULT 'draft',
  `created_by` INT,
  `approved_by` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `approved_at` DATETIME NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Journal Entry Lines
CREATE TABLE IF NOT EXISTS `journal_entry_lines` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `journal_entry_id` INT NOT NULL,
  `account_id` INT NOT NULL,
  `debit` DECIMAL(18,2) DEFAULT 0,
  `credit` DECIMAL(18,2) DEFAULT 0,
  `description` TEXT,
  FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id)
);

-- Payments
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `payment_number` VARCHAR(50) NOT NULL UNIQUE,
  `payment_date` DATE NOT NULL,
  `payment_type` ENUM('customer','vendor') NOT NULL,
  `entity_id` INT NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `payment_method` VARCHAR(50),
  `reference` VARCHAR(100),
  `notes` TEXT,
  `status` VARCHAR(50) DEFAULT 'completed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payment Allocations
CREATE TABLE IF NOT EXISTS `payment_allocations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `payment_id` INT NOT NULL,
  `invoice_id` INT NOT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Currencies
CREATE TABLE IF NOT EXISTS `currencies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(10) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `symbol` VARCHAR(10),
  `is_base` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Exchange Rates
CREATE TABLE IF NOT EXISTS `exchange_rates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `from_currency` VARCHAR(10) NOT NULL,
  `to_currency` VARCHAR(10) NOT NULL,
  `rate` DECIMAL(12,6) NOT NULL,
  `effective_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (from_currency, to_currency, effective_date)
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100),
  `entity_id` INT,
  `old_values` JSON,
  `new_values` JSON,
  `ip_address` VARCHAR(50),
  `user_agent` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Project Progress Logs
CREATE TABLE IF NOT EXISTS `project_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `progress_percentage` DECIMAL(5,2) NOT NULL,
  `milestone` VARCHAR(255),
  `notes` TEXT,
  `recorded_by` INT,
  `recorded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id)
);

-- Risk Logs
CREATE TABLE IF NOT EXISTS `risk_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `risk_score` INT NOT NULL,
  `risk_level` VARCHAR(50) NOT NULL,
  `factors` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Enhanced Invoices (add customer_id)
ALTER TABLE `invoices` 
  ADD COLUMN `customer_id` INT NULL AFTER `project_id`,
  ADD COLUMN `invoice_number` VARCHAR(50) NULL UNIQUE AFTER `id`,
  ADD COLUMN `due_date` DATE NULL AFTER `issued_at`,
  ADD COLUMN `currency_code` VARCHAR(10) DEFAULT 'USD' AFTER `amount`,
  ADD COLUMN `paid_amount` DECIMAL(14,2) DEFAULT 0 AFTER `amount`,
  ADD FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_vendors_name ON vendors(name);
CREATE INDEX idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Insert default data
INSERT INTO roles (name, description) VALUES
('admin', 'System Administrator'),
('finance_manager', 'Finance Manager'),
('project_manager', 'Project Manager'),
('accountant', 'Accountant'),
('user', 'Regular User')
ON DUPLICATE KEY UPDATE description=VALUES(description);

INSERT INTO permissions (name, description) VALUES
('manage_users', 'Manage users and roles'),
('view_financials', 'View financial reports'),
('edit_journal_entries', 'Create and edit journal entries'),
('approve_journal_entries', 'Approve journal entries'),
('manage_vendors', 'Manage vendors'),
('manage_customers', 'Manage customers'),
('view_audit_logs', 'View audit logs'),
('manage_projects', 'Manage projects'),
('view_projects', 'View projects')
ON DUPLICATE KEY UPDATE description=VALUES(description);

INSERT INTO currencies (code, name, symbol, is_base) VALUES
('USD', 'US Dollar', '$', TRUE),
('EUR', 'Euro', '€', FALSE),
('GBP', 'British Pound', '£', FALSE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Sample Chart of Accounts
INSERT INTO chart_of_accounts (code, name, type, category) VALUES
('1000', 'Cash', 'asset', 'Current Assets'),
('1100', 'Accounts Receivable', 'asset', 'Current Assets'),
('1200', 'Inventory', 'asset', 'Current Assets'),
('1500', 'Equipment', 'asset', 'Fixed Assets'),
('2000', 'Accounts Payable', 'liability', 'Current Liabilities'),
('2100', 'Short-term Loans', 'liability', 'Current Liabilities'),
('2500', 'Long-term Debt', 'liability', 'Long-term Liabilities'),
('3000', 'Owners Equity', 'equity', 'Equity'),
('3100', 'Retained Earnings', 'equity', 'Equity'),
('4000', 'Service Revenue', 'revenue', 'Operating Revenue'),
('4100', 'Project Revenue', 'revenue', 'Operating Revenue'),
('5000', 'Cost of Goods Sold', 'expense', 'Direct Costs'),
('5100', 'Labor Costs', 'expense', 'Direct Costs'),
('6000', 'Operating Expenses', 'expense', 'Operating Expenses'),
('6100', 'Administrative Expenses', 'expense', 'Operating Expenses')
ON DUPLICATE KEY UPDATE name=VALUES(name);
