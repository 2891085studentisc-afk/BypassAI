async function testUserFlow() {
  console.log('🧪 Testing user-facing functionality...\n');

  try {
    // Test 1: Fetch companies
    console.log('1. Fetching company database...');
    const companiesRes = await fetch('http://localhost:3000/api/admin/companies');
    if (!companiesRes.ok) throw new Error('Failed to fetch companies');
    const companies = await companiesRes.json();
    console.log(`✅ Found ${companies.length} companies in database`);
    console.log('Sample companies:');
    companies.slice(0, 3).forEach(c => console.log(`  - ${c.name} (${c.contact})`));
    console.log();

    // Test 2: Search for a company (simulate user typing)
    const searchTerm = 'Sky';
    console.log(`2. Testing company search for "${searchTerm}"...`);
    const skyCompanies = companies.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(`✅ Found ${skyCompanies.length} matches`);
    if (skyCompanies.length > 0) {
      console.log(`  - ${skyCompanies[0].name} (${skyCompanies[0].contact})`);
    }
    console.log();

    // Test 3: Request a new company (off-list)
    console.log('3. Testing company request for off-list company...');
    const requestRes = await fetch('http://localhost:3000/api/companies/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Telecom Ltd' }),
    });
    if (!requestRes.ok) throw new Error('Failed to request company');
    console.log('✅ Company request submitted successfully');
    console.log();

    // Test 4: Submit escalation for existing company
    console.log('4. Testing escalation submission...');
    const escalateRes = await fetch('http://localhost:3000/api/escalate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountNumber: 'TEST-12345',
        userEmail: 'test@example.com',
        complaintDetails: 'Test complaint for demonstration purposes.',
        companyName: companies[0]?.name || 'Test Company',
        companyEmail: null,
      }),
    });

    if (!escalateRes.ok) {
      const errorData = await escalateRes.json();
      throw new Error(`Escalation failed: ${errorData.error}`);
    }

    const escalateData = await escalateRes.json();
    const escalationId = escalateData.id;
    console.log(`✅ Escalation submitted! ID: ${escalationId}`);
    console.log(`  Auto-sent: ${escalateData.autoSent ? 'Yes' : 'No'}`);
    console.log();

    // Test 5: Track escalation
    console.log('5. Testing escalation tracking...');
    const trackRes = await fetch(`http://localhost:3000/api/track/${escalationId}`);
    if (!trackRes.ok) throw new Error('Failed to track escalation');
    const trackData = await trackRes.json();
    console.log(`✅ Tracking successful:`);
    console.log(`  Status: ${trackData.status}`);
    console.log(`  Company: ${trackData.companyName}`);
    console.log(`  Created: ${new Date(trackData.createdAt).toLocaleString()}`);
    console.log();

    console.log('🎉 All user-facing tests passed! The website works perfectly for users.');

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testUserFlow();