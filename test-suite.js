/**
 * UNIFIED TEST SUITE
 * Tests para API backend - autenticación y contacto
 * Uso: node test-suite.js [server_port] [test_mode]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuración
const SERVER_PORT = process.argv[2] || process.env.PORT || 3000;
const TEST_MODE = process.argv[3] || 'full'; // 'full', 'auth', 'contact'
const TEST_TIMEOUT = 30000; // 30 segundos
const BASE_URL = `http://localhost:${SERVER_PORT}`;

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Estadísticas
let stats = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Hacer request HTTP
 */
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: SERVER_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Suite/1.0'
      }
    };

    const timeoutId = setTimeout(() => {
      req.destroy();
      reject(new Error(`Timeout después de ${TEST_TIMEOUT}ms`));
    }, TEST_TIMEOUT);

    const req = http.request(options, (res) => {
      clearTimeout(timeoutId);
      let data = '';

      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            json: jsonData
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            json: null
          });
        }
      });
    });

    req.on('error', (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Ejecutar test
 */
async function runTest(name, fn) {
  stats.total++;
  process.stdout.write(`  ${colors.cyan}${name}${colors.reset} ... `);

  try {
    await fn();
    stats.passed++;
    console.log(`${colors.green}✓${colors.reset}`);
    return true;
  } catch (error) {
    stats.failed++;
    stats.errors.push({ name, error: error.message });
    console.log(`${colors.red}✗${colors.reset}`);
    console.log(`    ${colors.red}${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Assert helpers
 */
const assert = {
  equal: (actual, expected, msg) => {
    if (actual !== expected) {
      throw new Error(`${msg || 'Assertion failed'}: esperado ${expected}, obtuvo ${actual}`);
    }
  },
  includes: (haystack, needle, msg) => {
    if (!haystack.includes(needle)) {
      throw new Error(`${msg || 'Assertion failed'}: "${needle}" no encontrado en "${haystack}"`);
    }
  },
  ok: (value, msg) => {
    if (!value) throw new Error(msg || 'Assertion failed');
  },
  notOk: (value, msg) => {
    if (value) throw new Error(msg || 'Assertion failed');
  }
};

/**
 * Print header
 */
function printHeader(title) {
  console.log(`\n${colors.bright}${colors.cyan}${title}${colors.reset}\n`);
}

/**
 * Print summary
 */
function printSummary() {
  console.log(`\n${colors.bright}RESUMEN${colors.reset}`);
  console.log(`Total: ${stats.total}`);
  console.log(`${colors.green}Pasaron: ${stats.passed}${colors.reset}`);
  console.log(`${colors.red}Fallaron: ${stats.failed}${colors.reset}`);

  if (stats.errors.length > 0) {
    console.log(`\n${colors.bright}ERRORES${colors.reset}`);
    stats.errors.forEach(e => {
      console.log(`${colors.red}✗${colors.reset} ${e.name}`);
      console.log(`  ${e.error}`);
    });
  }

  const success = stats.failed === 0;
  console.log(`\n${success ? colors.green : colors.red}${success ? '✓ TODOS LOS TESTS PASARON' : '✗ ALGUNOS TESTS FALLARON'}${colors.reset}\n`);

  return success ? 0 : 1;
}

// ============================================
// TESTS
// ============================================

/**
 * Tests de Autenticación
 */
async function runAuthTests() {
  printHeader('🔐 TESTS DE AUTENTICACIÓN');

  const testUsername = `user_${Date.now()}`;
  const testPassword = 'Password123!';

  // Test 1: Registro
  await runTest('Registrar usuario válido', async () => {
    const res = await makeRequest('POST', '/api/register', {
      username: testUsername,
      password: testPassword
    });
    assert.equal(res.statusCode, 201, `Status code debe ser 201, obtuvo ${res.statusCode}`);
    assert.ok(res.json.message, 'Response debe contener mensaje');
  });

  // Test 2: Registro - Usuario duplicado
  await runTest('Registrar usuario duplicado debe fallar', async () => {
    const res = await makeRequest('POST', '/api/register', {
      username: testUsername,
      password: testPassword
    });
    assert.equal(res.statusCode, 409, `Status code debe ser 409, obtuvo ${res.statusCode}`);
  });

  // Test 3: Registro - Campos requeridos
  await runTest('Registrar sin username debe fallar', async () => {
    const res = await makeRequest('POST', '/api/register', {
      password: 'test'
    });
    assert.equal(res.statusCode, 400, `Status code debe ser 400, obtuvo ${res.statusCode}`);
  });

  // Test 4: Login válido
  await runTest('Login con credenciales válidas', async () => {
    const res = await makeRequest('POST', '/api/login', {
      username: testUsername,
      password: testPassword
    });
    assert.equal(res.statusCode, 200, `Status code debe ser 200, obtuvo ${res.statusCode}`);
    assert.ok(res.json.message, 'Response debe contener mensaje');
    assert.ok(res.json.userId, 'Response debe contener userId');
  });

  // Test 5: Login - Contraseña incorrecta
  await runTest('Login con contraseña incorrecta debe fallar', async () => {
    const res = await makeRequest('POST', '/api/login', {
      username: testUsername,
      password: 'wrongpassword'
    });
    assert.equal(res.statusCode, 401, `Status code debe ser 401, obtuvo ${res.statusCode}`);
  });

  // Test 6: Login - Usuario no existe
  await runTest('Login con usuario no existente debe fallar', async () => {
    const res = await makeRequest('POST', '/api/login', {
      username: 'nonexistentuser',
      password: 'password'
    });
    assert.equal(res.statusCode, 401, `Status code debe ser 401, obtuvo ${res.statusCode}`);
  });
}

/**
 * Tests de Contacto
 */
async function runContactTests() {
  printHeader('📧 TESTS DE CONTACTO');

  // Test 1: Cotización válida
  await runTest('Enviar cotización válida', async () => {
    const res = await makeRequest('POST', '/api/contact', {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'test@example.com',
      telefono: '+56912345678',
      direccion: 'Calle Test 123',
      rol: 'cliente'
    });
    assert.equal(res.statusCode, 200, `Status code debe ser 200, obtuvo ${res.statusCode}`);
    assert.ok(res.json.id, 'Response debe contener ID');
  });

  // Test 2: Cotización - Campos requeridos
  await runTest('Cotización sin nombre debe fallar', async () => {
    const res = await makeRequest('POST', '/api/contact', {
      apellido: 'Pérez',
      email: 'test@example.com'
    });
    assert.equal(res.statusCode, 400, `Status code debe ser 400, obtuvo ${res.statusCode}`);
  });

  // Test 3: Mensaje de contacto válido
  await runTest('Enviar mensaje de contacto válido', async () => {
    const res = await makeRequest('POST', '/api/contact-footer', {
      nombre: 'María',
      apellido: 'García',
      email: 'test@example.com',
      telefono: '+56987654321',
      mensaje: 'Mensaje de prueba'
    });
    assert.equal(res.statusCode, 200, `Status code debe ser 200, obtuvo ${res.statusCode}`);
    assert.ok(res.json.id, 'Response debe contener ID');
  });

  // Test 4: Mensaje de contacto - Campos requeridos
  await runTest('Mensaje sin email debe fallar', async () => {
    const res = await makeRequest('POST', '/api/contact-footer', {
      nombre: 'Test',
      apellido: 'User',
      mensaje: 'Test'
    });
    assert.equal(res.statusCode, 400, `Status code debe ser 400, obtuvo ${res.statusCode}`);
  });
}

/**
 * Tests de Conexión
 */
async function runConnectionTests() {
  printHeader('🔌 TESTS DE CONEXIÓN');

  await runTest(`Servidor está activo en ${BASE_URL}`, async () => {
    try {
      const res = await makeRequest('GET', '/');
      // GET / probablemente retorne 404, pero eso significa que el servidor está activo
      if (res.statusCode === 404 || res.statusCode === 200) {
        return true;
      }
      throw new Error(`Respuesta inesperada: ${res.statusCode}`);
    } catch (error) {
      throw new Error(`No se puede conectar al servidor: ${error.message}`);
    }
  });
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log(`\n${colors.bright}${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}║  BACKEND TEST SUITE - Hot and Cold API  ║${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}╚════════════════════════════════════════╝${colors.reset}`);
  console.log(`\n${colors.dim}Puerto: ${SERVER_PORT} | Modo: ${TEST_MODE} | Timeout: ${TEST_TIMEOUT}ms${colors.reset}`);

  try {
    // Esperar a que el servidor esté listo
    console.log(`\n${colors.yellow}⏳ Esperando a que el servidor esté listo...${colors.reset}`);
    await new Promise(r => setTimeout(r, 1000));

    // Ejecutar tests según modo
    await runConnectionTests();

    if (TEST_MODE === 'full' || TEST_MODE === 'auth') {
      await runAuthTests();
    }

    if (TEST_MODE === 'full' || TEST_MODE === 'contact') {
      await runContactTests();
    }

    // Mostrar resumen
    const exitCode = printSummary();
    process.exit(exitCode);
  } catch (error) {
    console.error(`\n${colors.red}❌ Error fatal: ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

// Ejecutar
if (require.main === module) {
  main().catch(error => {
    console.error(`\n${colors.red}Error no manejado: ${error.message}${colors.reset}\n`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { makeRequest, assert, runTest };
