const fetch = require('node-fetch');

// Main handler function for the serverless function
exports.handler = async (event, context) => {
  // Extract the API endpoint from the path
  const path = event.path.replace('/.netlify/functions/proxy/', '');
  
  // The API URL to forward to (our RDS-connected backend)
  const API_URL = 'https://esc-wear-api.onrender.com';
  
  try {
    // Set the URL to forward the request to
    const url = `${API_URL}/${path}`;
    
    // Forward the method, body, and headers
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        'Content-Type': 'application/json',
      },
      body: event.body,
    });

    // Get the response data
    const data = await response.text();
    
    // Return the response with appropriate status code and headers
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json',
      },
      body: data,
    };
  } catch (error) {
    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred proxying the request' }),
    };
  }
}; 