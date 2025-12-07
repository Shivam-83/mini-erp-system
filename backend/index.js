require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const invoiceRoutes = require('./routes/invoices');
const dashboardRoutes = require('./routes/dashboard');
const insightsRoutes = require('./routes/insights');
const docsRoutes = require('./routes/docs');
const usersRoutes = require('./routes/users');
const customersRoutes = require('./routes/customers');
const vendorsRoutes = require('./routes/vendors');
const journalRoutes = require('./routes/journal');
const financialsRoutes = require('./routes/financials');
const { errorHandler } = require('./middleware/errorHandler');

// Security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
app.use(helmet());

// CORS configuration for production and development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  process.env.FRONTEND_URL // Add your Netlify URL here
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Basic rate limiting
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/vendors', vendorsRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/financials', financialsRoutes);

app.use(errorHandler);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
