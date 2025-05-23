const { spawn, exec } = require('child_process');
const path = require('path');

// Function to kill processes on a specific port (Windows version)
function killProcessOnPort(port) {
    return new Promise((resolve, reject) => {
        // First find the PID using the port
        const findCommand = `netstat -ano | findstr :${port}`;
        
        exec(findCommand, (error, stdout) => {
            if (error) {
                console.log(`No process found on port ${port}`);
                return resolve();
            }
            
            try {
                // Parse the output to get PIDs
                const lines = stdout.trim().split('\n');
                const pids = [];
                
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 4) {
                        const pid = parts[4];
                        if (pid && !pids.includes(pid)) {
                            pids.push(pid);
                        }
                    }
                }
                
                if (pids.length === 0) {
                    console.log(`No process found using port ${port}`);
                    return resolve();
                }
                
                // Kill each PID
                for (const pid of pids) {
                    console.log(`Killing process with PID ${pid} on port ${port}`);
                    exec(`taskkill /F /PID ${pid}`, (killError) => {
                        if (killError) {
                            console.error(`Failed to kill process ${pid}:`, killError.message);
                        } else {
                            console.log(`Successfully killed process ${pid}`);
                        }
                    });
                }
                
                // Give some time for processes to be killed
                setTimeout(resolve, 1000);
            } catch (parseError) {
                console.error('Error parsing netstat output:', parseError);
                resolve();
            }
        });
    });
}

// Kill any processes using port 5000 and 3000
console.log('Checking for processes using ports 5000 and 3000...');
Promise.all([
    killProcessOnPort(5000),
    killProcessOnPort(3000)
]).then(() => {
    // Start backend server
    console.log('Starting backend server...');
    const backend = spawn('node', ['server.js'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: 'inherit',
        shell: true
    });

    backend.on('error', (error) => {
        console.error('Failed to start backend server:', error);
    });

    // Give the backend a moment to start up
    setTimeout(() => {
        // Create admin user
        console.log('Creating admin user...');
        const createAdmin = spawn('node', ['createAdmin.js'], {
            cwd: path.join(__dirname, 'backend'),
            stdio: 'inherit',
            shell: true
        });

        createAdmin.on('error', (error) => {
            console.error('Failed to create admin user:', error);
        });
        
        // After admin user is created, create sample products
        createAdmin.on('exit', () => {
            console.log('Creating sample products...');
            const createProducts = spawn('node', ['createSampleProducts.js'], {
                cwd: path.join(__dirname, 'backend'),
                stdio: 'inherit',
                shell: true
            });
            
            createProducts.on('error', (error) => {
                console.error('Failed to create sample products:', error);
            });
        });
    }, 2000);

    // Start frontend server
    console.log('Starting frontend server...');
    const frontend = spawn('node', ['frontend-server.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    frontend.on('error', (error) => {
        console.error('Failed to start frontend server:', error);
    });

    console.log('Both servers starting...');
    console.log('You can access the website at: http://localhost:3000');
    console.log('Admin credentials: admin@example.com / admin123');

    // Handle cleanup on exit
    process.on('SIGINT', () => {
        console.log('Shutting down servers...');
        backend.kill();
        frontend.kill();
        process.exit(0);
    });
}); 