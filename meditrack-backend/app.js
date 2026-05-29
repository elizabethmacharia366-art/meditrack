const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const logger = require('./middleware/logger');
const { attachUser } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const swaggerSpec = require('./swagger');

const patientsRoutes = require('./routes/patientsRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const prescriptionsRoutes = require('./routes/prescriptionsRoutes');
const hospitalsRoutes = require('./routes/hospitalsRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(logger);
}
app.use(attachUser);

app.get('/', (_req, res) => res.send('MediTrack Backend Running'));

// Swagger docs
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/patients', patientsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// 404 fallback for unknown API routes
app.use('/api', (_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use(errorHandler);

module.exports = app;
