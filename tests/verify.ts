// verify.ts
// Integration test suite validating auth, database, and ML endpoints.

import http from 'http';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

const request = (path: string, method: 'GET' | 'POST', body?: any, token?: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`Request to ${path} failed with code ${res.statusCode}: ${responseBody}`));
          return;
        }
        try {
          resolve(JSON.parse(responseBody));
        } catch {
          resolve(responseBody);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(data);
    }
    req.end();
  });
};

async function runTests() {
  console.log('--------------------------------------------------');
  console.log('Starting Integration Testing Telemetry...');
  console.log('--------------------------------------------------');
  
  let token = '';
  
  // Test 1: JWT Authentication Login
  try {
    const authResult = await request('/api/auth/login', 'POST', {
      username: 'admin',
      password: 'admin123',
      company: 'Nexus Automotive Systems'
    });
    if (authResult && authResult.token) {
      token = authResult.token;
      console.log('✔ Test 1: Authentication JWT Login passed.');
    } else {
      throw new Error('No token returned in auth body.');
    }
  } catch (err: any) {
    console.error('✘ Test 1 failed:', err.message);
    process.exit(1);
  }

  // Test 2: JWT Verification endpoint
  try {
    const verifyResult = await request('/api/auth/verify', 'POST', { token });
    if (verifyResult && verifyResult.username === 'admin') {
      console.log('✔ Test 2: Session Token verify passed.');
    } else {
      throw new Error('Verify payload mismatch.');
    }
  } catch (err: any) {
    console.error('✘ Test 2 failed:', err.message);
    process.exit(1);
  }

  // Test 3: Dashboard Aggregation analytics
  try {
    const dash = await request('/api/dashboard', 'GET', undefined, token);
    if (dash && typeof dash.total_suppliers === 'number' && dash.total_suppliers > 0) {
      console.log(`✔ Test 3: Dashboard telemetry passed. Total Suppliers: ${dash.total_suppliers}.`);
    } else {
      throw new Error('Dashboard body format mismatch.');
    }
  } catch (err: any) {
    console.error('✘ Test 3 failed:', err.message);
    process.exit(1);
  }

  // Test 4: Suppliers listing query filtration
  try {
    const list = await request('/api/suppliers?limit=5', 'GET', undefined, token);
    if (Array.isArray(list) && list.length > 0) {
      console.log(`✔ Test 4: Paginated query list passed. Suppliers fetched: ${list.length}.`);
    } else {
      throw new Error('Query output format mismatch.');
    }
  } catch (err: any) {
    console.error('✘ Test 4 failed:', err.message);
    process.exit(1);
  }

  // Test 5: ML Inference Predictions API
  try {
    const inference = await request('/api/predict', 'POST', { supplier_id: 'SUP000158' }, token);
    if (inference && inference.prediction && typeof inference.prediction.trust_score === 'number') {
      console.log(`✔ Test 5: ML Inference prediction passed. Trust Score: ${inference.prediction.trust_score}.`);
    } else {
      throw new Error('Inference body mapping mismatch.');
    }
  } catch (err: any) {
    console.error('✘ Test 5 failed:', err.message);
    process.exit(1);
  }

  // Test 6: Simulator delta propagation
  try {
    const sim = await request('/api/simulate', 'POST', {
      supplier_id: 'SUP000158',
      revenue_change: -20,
      cash_flow_change: -10,
      delivery_delay_change: 4,
      complaints_change: 2,
      defect_rate_change: 1.5
    }, token);
    if (sim && typeof sim.simulated_trust_score === 'number') {
      console.log(`✔ Test 6: Simulator variables propagation passed. Simulated Trust: ${sim.simulated_trust_score} (baseline: ${sim.baseline_trust_score}).`);
    } else {
      throw new Error('Simulation result mismatch.');
    }
  } catch (err: any) {
    console.error('✘ Test 6 failed:', err.message);
    process.exit(1);
  }

  // Test 7: AI Copilot Assistant endpoint
  try {
    const chat = await request('/api/chat', 'POST', { question: 'Who is Nexus Automotive Systems safest supplier?' }, token);
    if (chat && (chat.answer || chat.reply)) {
      console.log('✔ Test 7: AI Copilot endpoint response format verified.');
    } else {
      throw new Error('Copilot response format mismatch.');
    }
  } catch (err: any) {
    console.error('✘ Test 7 failed:', err.message);
    process.exit(1);
  }

  console.log('--------------------------------------------------');
  console.log('All 7 Integration Tests Passed Successfully!');
  console.log('--------------------------------------------------');
}

runTests();
