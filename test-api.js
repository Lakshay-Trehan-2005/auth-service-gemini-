const http = require('http');

const request = (path, method, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log('--- 🧪 STARTING API TESTS ---\n');
    
    // Generate random email for testing
    const email = `test_${Date.now()}@example.com`;
    const password = 'Password123!';

    // 1. Register
    console.log(`[1] Registering new user: ${email}`);
    const registerRes = await request('/api/auth/register', 'POST', {
      email,
      password,
      name: 'Terminal Test User'
    });
    console.log('Status:', registerRes.status);
    console.log('Response:', registerRes.data);
    console.log('\n-----------------------------------\n');

    // 2. Login
    console.log('[2] Logging in with the new user...');
    const loginRes = await request('/api/auth/login', 'POST', {
      email,
      password
    });
    console.log('Status:', loginRes.status);
    console.log('Response:', loginRes.data);
    console.log('\n-----------------------------------\n');

    // 3. Test Protected Route (Logout)
    if (loginRes.data && loginRes.data.data && loginRes.data.data.accessToken) {
      const accessToken = loginRes.data.data.accessToken;
      console.log('[3] Testing protected route (Logout)...');
      const logoutRes = await request('/api/auth/logout', 'POST', null, accessToken);
      console.log('Status:', logoutRes.status);
      console.log('Response:', logoutRes.data);
      console.log('\n✅ All tests completed successfully!');
    } else {
      console.log('❌ Login failed or no tokens found, skipping protected route test.');
    }

  } catch (err) {
    console.error('Error during testing:', err.message);
  }
};

runTests();
