const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const sequelize = require('./config/database');

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'super_secret_key_12345';
}
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Create Express app
const app = express();

// CORS configuration - allow requests from frontend
// In production, update this to your frontend URL
const allowedOrigins = [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    // Add your production frontend URL when deployed
    process.env.FRONTEND_URL
].filter(Boolean); // Filter out undefined/null values

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase JSON payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Test MySQL connection
sequelize.authenticate()
    .then(() => console.log('Connected to MySQL database.'))
    .catch(err => {
        console.error('Unable to connect to MySQL:', err);
        process.exit(1);
    });

// Import models to register them with Sequelize
require('./models/User');
require('./models/Product');
require('./models/Order');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'ESC Fit Club API is running',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Function to start server with port retry
const startServer = (port) => {
    port = Number(port || process.env.PORT || 5000); // Use environment variable or default to 5000
    
    // In local development, check if port is available
    if (process.env.NODE_ENV !== 'production') {
        try {
            const http = require('http');
            const server = http.createServer();
            server.listen(port);
            server.close();
        } catch (err) {
            console.error(`Port ${port} is busy, trying another port...`);
            return startServer(port + 1);
        }
    }
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }).on('error', (err) => {
        console.error(`Error starting server on port ${port}:`, err.message);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Trying another port...');
            startServer(port + 1);
        } else {
            process.exit(1);
        }
    });
};

// Sync Sequelize models with the database
sequelize.sync({ alter: process.env.NODE_ENV !== 'production' })
    .then(() => {
        // Start server with initial port
        const initialPort = Number(process.env.PORT) || 5000;
        startServer(initialPort);
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
        process.exit(1);
    });

module.exports = { app, sequelize }; 