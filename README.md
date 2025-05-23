# ESC Fit Club Website

This is the codebase for the ESC Fit Club e-commerce website.

## Project Structure

- `frontend/` - Frontend React components and assets
- `backend/` - Node.js/Express API server
- Static HTML, CSS, and JavaScript files in the root directory

## Deployment Instructions

### Frontend (Netlify)

1. Create an account on [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository or drag-and-drop the frontend folder
3. Configure the build settings:
   - Build command: leave empty (for static site)
   - Publish directory: `./`

### Backend (Render, Heroku, or AWS)

The backend needs to be deployed separately as Netlify only supports static websites.

#### Option 1: Render.com

1. Create an account on [Render](https://render.com/)
2. Create a new Web Service and connect your GitHub repository
3. Configure the build settings:
   - Build command: `npm install`
   - Start command: `node server.js`
4. Add environment variables:
   ```
   MYSQL_DATABASE=so_web
   MYSQL_USER=admin
   MYSQL_PASSWORD=ESCwear2025
   MYSQL_HOST=esc.cp8w0220u9dr.eu-north-1.rds.amazonaws.com
   MYSQL_DIALECT=mysql
   JWT_SECRET=super_secret_key_12345
   ```

#### Option 2: AWS Elastic Beanstalk

1. Create an AWS account if you don't have one
2. Install the AWS CLI and EB CLI
3. Initialize EB CLI in your project:
   ```
   cd backend
   eb init
   ```
4. Create an environment:
   ```
   eb create so-web-backend
   ```
5. Set environment variables:
   ```
   eb setenv MYSQL_DATABASE=so_web MYSQL_USER=admin MYSQL_PASSWORD=ESCwear2025 MYSQL_HOST=esc.cp8w0220u9dr.eu-north-1.rds.amazonaws.com MYSQL_DIALECT=mysql JWT_SECRET=super_secret_key_12345
   ```

## Connecting Frontend to Backend

After deploying the backend, update the API_BASE_URL in `shared.js` to point to your deployed backend URL:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://your-backend-url.com/api'; // Update this with your actual backend URL
```

## Database

The application is configured to connect to an AWS RDS MySQL database. Make sure the database server allows connections from your deployed backend. 