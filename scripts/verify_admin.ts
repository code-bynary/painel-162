import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function verifyAdmin() {
    console.log('--- Starting Admin Verification ---');

    try {
        // 1. Login as Admin
        console.log('1. Logging in as admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin'
        });
        const token = loginRes.data.token;
        console.log('   Success! Token received.');

        const headers = { Authorization: `Bearer ${token}` };

        // 2. List Users
        console.log('2. Listing Users...');
        const usersRes = await axios.get(`${API_URL}/admin/users`, { headers });
        console.log(`   Success! Found ${usersRes.data.length} users.`);

        // 3. Ban User (Mock)
        console.log('3. Testing Ban User...');
        // We assume user 2 is 'player'
        const banRes = await axios.post(`${API_URL}/admin/users/2/ban`, {}, { headers });
        console.log(`   Success! ${banRes.data.message}`);

        // 4. Get User Characters
        console.log('4. Getting Admin Characters...');
        const charsRes = await axios.get(`${API_URL}/admin/users/1/characters`, { headers });
        console.log(`   Success! Found ${charsRes.data.length} characters.`);
        const charId = charsRes.data[0].id;

        // 5. View Inventory
        console.log(`5. Viewing Inventory for Char ID ${charId}...`);
        const invRes = await axios.get(`${API_URL}/admin/characters/${charId}/inventory`, { headers });
        console.log(`   Success! Found ${invRes.data.length} items.`);

        console.log('--- Verification Complete: ALL PASS ---');

    } catch (error: any) {
        console.error('--- Verification FAILED ---');
        console.error(error.response ? error.response.data : error.message);
    }
}

verifyAdmin();
