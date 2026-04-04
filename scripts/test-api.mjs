const BASE_URL = 'http://localhost:3000';

async function testWorkflow() {
  console.log('🚀 Starting Bypass.ai Workflow Test...\n');

  try {
    // 1. Test Escalation Creation (Direct-to-CEO)
    console.log('Step 1: Creating a test escalation for an off-list company with AI email...');
    const createRes = await fetch(`${BASE_URL}/api/escalate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountNumber: 'TEST-OFFLIST-999',
        userEmail: 'user@example.com',
        complaintDetails: 'Small company test complaint.',
        companyName: 'Local Pizza Shop',
        companyEmail: 'owner@localpizza.co.uk'
      }),
    });

    if (!createRes.ok) throw new Error('Failed to create escalation');
    const createData = await createRes.json();
    const escalationId = createData.id;
    
    if (!createData.autoSent) throw new Error('Escalation should have been auto-sent given companyEmail');
    console.log(`✅ Escalation created and AUTO-SENT! ID: ${escalationId}\n`);

    // 2. Test Admin List
    console.log('Step 2: Verifying admin list API...');
    const listRes = await fetch(`${BASE_URL}/api/admin/escalation/list`);
    if (!listRes.ok) throw new Error('Failed to fetch admin list');
    const listData = await listRes.json();
    const found = listData.find(e => e.id === escalationId);
    if (!found) throw new Error('New escalation not found in admin list');
    console.log('✅ Escalation found in admin list!\n');

    // 3. Test Status Update
    console.log('Step 3: Updating escalation status...');
    const updateRes = await fetch(`${BASE_URL}/api/admin/escalation/${escalationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'REVIEWING' }),
    });
    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(`Failed to update status: ${errData.error || updateRes.statusText}`);
    }
    const updateData = await updateRes.json();
    if (updateData.status !== 'REVIEWING') throw new Error('Status was not updated correctly');
    console.log('✅ Status updated to REVIEWING!\n');

    // 4. Test Delete
    console.log('Step 4: Cleaning up (deleting test record)...');
    const deleteRes = await fetch(`${BASE_URL}/api/admin/escalation/${escalationId}`, {
      method: 'DELETE',
    });
    if (!deleteRes.ok) throw new Error('Failed to delete escalation');
    console.log('✅ Test record deleted successfully!\n');

    console.log('✨ ALL TESTS PASSED! Bypass.ai is ready for deployment.');
  } catch (err) {
    console.error('❌ TEST FAILED:', err.message);
    process.exit(1);
  }
}

testWorkflow();
