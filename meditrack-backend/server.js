const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

app.use(logger);
app.use(auth);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.error(err));

const patientsRoutes = require('./routes/patientsRoutes');
const doctorsRoutes = require('./routes/doctorsRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const prescriptionsRoutes = require('./routes/prescriptionsRoutes');
const hospitalsRoutes = require('./routes/hospitalsRoutes');
const authRoutes = require('./routes/authRoutes');

app.get('/', (req, res) => res.send('MediTrack Backend Running'));

app.use('/api/patients', patientsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/prescriptions', prescriptionsRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
