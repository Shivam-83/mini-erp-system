USE `mini_erp`;
USE `mini_erp`;

INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$cgXw4CG/bSXUnATfxf29eezQlZ30S.M8ei2H7O5FWPg6NpyFz7gRa', 'admin');

INSERT INTO projects (name, description, budget, spent, progress) VALUES
('Site A - Phase 1', 'Foundations and structure', 1000000, 200000, 20),
('Site B - Renovation', 'Refurbishment works', 250000, 50000, 10);

INSERT INTO accounts (name, type, balance) VALUES
('Accounts Receivable','asset',0);

INSERT INTO invoices (project_id, description, amount, status) VALUES
(1,'Invoice for foundations', 150000,'issued'),
(2,'Initial scaffolding', 30000,'paid');
