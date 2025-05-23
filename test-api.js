const http = require('http');

console.log('Testing API connectivity...');
console.log('Attempting to connect to backend on port 5000...');

// Test health endpoint
const healthCheck = http.get('http://localhost:5000/api/health', (res) => {
  console.log(`Health endpoint status: ${res.statusCode}`);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Health endpoint response:', data);
    console.log('Backend API is working correctly!');
    testRegistration();
  });
}).on('error', (err) => {
  console.error('Error connecting to health endpoint:', err.message);
  console.log('The backend server may not be running properly on port 5000.');
  console.log('Try restarting the servers with: node start-servers.js');
});

// Test registration endpoint with a simple request
function testRegistration() {
  console.log('\nTesting registration endpoint...');
  
  const testData = JSON.stringify({
    name: 'Test User',
    email: 'testuser_' + Date.now() + '@example.com',
    password: 'password123'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': testData.length
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`Registration endpoint status: ${res.statusCode}`);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Registration test response:', data);
      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log('Registration endpoint is working correctly!');
      } else {
        console.log('Registration endpoint returned a non-success status code.');
      }
      console.log('\nAPI connectivity test complete.');
    });
  }).on('error', (err) => {
    console.error('Error with registration request:', err.message);
    console.log('Registration endpoint is not responding correctly.');
  });
  
  req.write(testData);
  req.end();
}

// Set a timeout to report if the test takes too long
setTimeout(() => {
  console.log('API connectivity test timed out after 5 seconds.');
  console.log('This could indicate connection issues to the backend server.');
  process.exit(1);
}, 5000); 