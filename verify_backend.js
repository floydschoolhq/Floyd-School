const API_URL = 'http://localhost:5000/api';

const testBackend = async () => {
    try {
        console.log('--- Testing Backend API ---');

        // 1. Test Signup
        console.log('\n1. Testing Signup...');
        const signupData = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'student'
        };

        const signupRes = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });
        const signupJson = await signupRes.json();

        if (!signupRes.ok) throw new Error(signupJson.message);
        console.log('Signup Successful:', signupJson.email);
        const token = signupJson.token;

        // 2. Test Login
        console.log('\n2. Testing Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: signupData.email,
                password: signupData.password
            })
        });
        const loginJson = await loginRes.json();

        if (!loginRes.ok) throw new Error(loginJson.message);
        console.log('Login Successful:', loginJson.email);

        // 3. Test Book Demo
        console.log('\n3. Testing Book Demo...');
        const demoRes = await fetch(`${API_URL}/contact/book-demo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                date: new Date().toISOString(),
                email: signupData.email
            })
        });
        const demoJson = await demoRes.json();

        if (!demoRes.ok) throw new Error(demoJson.message);
        console.log('Book Demo Successful:', demoJson.message);

        console.log('\n--- All Tests Passed ---');

    } catch (error) {
        console.error('\nTest Failed:', error.message);
    }
};

testBackend();
