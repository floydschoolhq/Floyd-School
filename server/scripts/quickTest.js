const axios = require('axios');

async function check() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'offline.admin@floydschool.in',
            password: 'AdminTest@2026!'
        });
        console.log('Login status:', loginRes.status, 'Token exists:', !!loginRes.data.token);
        const token = loginRes.data.token;

        const dashRes = await axios.get('http://localhost:5000/api/offline-admin/dashboard', {
            headers: { Authorization: 'Bearer ' + token }
        });
        console.log('Dashboard status:', dashRes.status, 'Counts:', dashRes.data.data.counts);
        console.log('Academic stats:', dashRes.data.data.academic);
    } catch(e) {
        console.error('Check failed:', e.response?.data || e.message);
    }
}
check();
