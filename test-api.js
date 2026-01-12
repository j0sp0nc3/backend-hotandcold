// test-api.js
const http = require('http');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Iniciando pruebas del API...\n');
  
  // Esperar a que el servidor esté listo
  await new Promise(r => setTimeout(r, 1000));

  try {
    // Test 1: Registrar usuario
    console.log('Test 1: POST /api/register');
    const registerRes = await makeRequest('POST', '/api/register', {
      username: 'testuser',
      password: 'password123'
    });
    console.log(`Status: ${registerRes.statusCode}`);
    console.log(`Response: ${registerRes.body}\n`);

    // Test 2: Login
    console.log('Test 2: POST /api/login');
    const loginRes = await makeRequest('POST', '/api/login', {
      username: 'testuser',
      password: 'password123'
    });
    console.log(`Status: ${loginRes.statusCode}`);
    console.log(`Response: ${loginRes.body}\n`);

    console.log('✅ Pruebas completadas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runTests();
