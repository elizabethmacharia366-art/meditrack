const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'MediTrack API',
      version: '1.0.0',
      description:
        'REST API for the MediTrack hospital management system. Most endpoints require a Bearer JWT obtained from `/api/auth/login`.',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local dev' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['patient', 'doctor', 'hospital', 'admin'] },
            provider: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            emailVerified: { type: 'boolean' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            role: { type: 'string', enum: ['patient', 'doctor', 'hospital'], default: 'patient' },
            location: { type: 'string' },
            hospitalName: { type: 'string' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            provider: { type: 'string', default: 'email' },
          },
        },
        AdminLoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
        },
        Hospital: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' },
            departments: { type: 'array', items: { type: 'string' } },
            contact: { type: 'string' },
            hours: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        HospitalInput: {
          type: 'object',
          required: ['name', 'location'],
          properties: {
            name: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' },
            departments: { type: 'array', items: { type: 'string' } },
            contact: { type: 'string' },
            hours: { type: 'string' },
          },
        },
        Doctor: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            fullName: { type: 'string' },
            specialty: { type: 'string' },
            contact: { type: 'string' },
            hospitalId: { oneOf: [{ type: 'string' }, { $ref: '#/components/schemas/Hospital' }] },
            schedule: {
              type: 'array',
              items: {
                type: 'object',
                properties: { day: { type: 'string' }, time: { type: 'string' } },
              },
            },
          },
        },
        DoctorInput: {
          type: 'object',
          required: ['fullName'],
          properties: {
            fullName: { type: 'string' },
            specialty: { type: 'string' },
            contact: { type: 'string' },
            hospitalId: { type: 'string' },
            schedule: {
              type: 'array',
              items: {
                type: 'object',
                properties: { day: { type: 'string' }, time: { type: 'string' } },
              },
            },
          },
        },
        Patient: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            fullName: { type: 'string' },
            age: { type: 'integer' },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
            contact: { type: 'string' },
            bloodGroup: { type: 'string', enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
            medicalHistory: { type: 'array', items: { type: 'string' } },
          },
        },
        PatientInput: {
          type: 'object',
          required: ['fullName'],
          properties: {
            fullName: { type: 'string' },
            age: { type: 'integer' },
            gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
            contact: { type: 'string' },
            bloodGroup: { type: 'string' },
            medicalHistory: { type: 'array', items: { type: 'string' } },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            doctorId: { type: 'string' },
            hospitalId: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['Scheduled', 'Completed', 'Cancelled'] },
            reminderDate: { type: 'string', format: 'date-time' },
            reminderMessage: { type: 'string' },
            reminderSent: { type: 'boolean' },
          },
        },
        AppointmentInput: {
          type: 'object',
          required: ['patientId', 'doctorId', 'date'],
          properties: {
            patientId: { type: 'string' },
            doctorId: { type: 'string' },
            hospitalId: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['Scheduled', 'Completed', 'Cancelled'] },
            reminderDate: { type: 'string', format: 'date-time' },
            reminderMessage: { type: 'string' },
          },
        },
        Prescription: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            patientId: { type: 'string' },
            doctorId: { type: 'string' },
            diagnosis: { type: 'string' },
            medicines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  dosage: { type: 'string' },
                  frequency: { type: 'string' },
                },
              },
            },
            notes: { type: 'string' },
          },
        },
        PrescriptionInput: {
          type: 'object',
          required: ['patientId'],
          properties: {
            patientId: { type: 'string' },
            doctorId: { type: 'string' },
            diagnosis: { type: 'string' },
            medicines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  dosage: { type: 'string' },
                  frequency: { type: 'string' },
                },
              },
            },
            notes: { type: 'string' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required or invalid token',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        Forbidden: {
          description: 'Insufficient role / not the resource owner',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        NotFound: {
          description: 'Resource not found',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        ValidationError: {
          description: 'Bad request / validation error',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth' },
      { name: 'Hospitals' },
      { name: 'Doctors' },
      { name: 'Patients' },
      { name: 'Appointments' },
      { name: 'Prescriptions' },
    ],
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

module.exports = swaggerJSDoc(options);
