# ESC Fit Club E-commerce Platform

A full-stack e-commerce web application for ESC Fit Club, featuring user authentication, product catalog, shopping cart, and order management.

## Features

- User authentication and account management
- Product browsing and filtering by categories
- Shopping cart functionality
- Secure checkout process
- Order history and tracking
- Admin dashboard for product and order management

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap for responsive design
- Fetch API for connecting to backend

### Backend
- Node.js with Express.js
- MySQL database with Sequelize ORM
- JWT for authentication
- AWS RDS for database hosting

## Installation

1. Clone the repository
```
git clone https://github.com/yourusername/esc-fit-club.git
cd esc-fit-club
```

2. Install dependencies
```
npm install
cd backend
npm install
```

3. Set up environment variables
Create a .env file in the backend directory with the following:
```
MYSQL_DATABASE=so_web
MYSQL_USER=admin
MYSQL_PASSWORD=your_password
MYSQL_HOST=your_database_endpoint
MYSQL_DIALECT=mysql
JWT_SECRET=your_secret_key
```

4. Start the application
```
node start-servers.js
```

5. Access the website at http://localhost:3000

## Deployment

The application is configured for deployment with:
- Frontend accessible through static file serving
- Backend API running on Node.js
- Database on AWS RDS

## License

This project is licensed under the MIT License - see the LICENSE file for details. 