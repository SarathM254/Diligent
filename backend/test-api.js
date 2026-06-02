const BASE_URL = process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3000';

async function runTests() {
  console.log('==========================================');
  console.log('   Diligent API Test Dashboard');
  console.log('==========================================\n');

  try {
    // 1. Verify the server is listening
    console.log('Step 1: Checking if server is running...');
    const healthCheck = await fetch(`${BASE_URL}/`);
    
    if (healthCheck.ok) {
      const healthData = await healthCheck.json();
      console.log('✅ Server is active and listening.');
      console.log(`   Message: ${healthData.message}\n`);
    } else {
      console.error('❌ Server is not responding correctly.');
      return;
    }

    // 2. Simulate POST request to /api/bills to test draft creation
    console.log('Step 2: Testing Draft Bill Creation (POST /api/bills)...');
    
    // Sample items payload representing a salesman's workflow
    const mockBillPayload = {
      salesmanId: '65af1b2c3d4e5f6a7b8c9d0e',
      billingDate: new Date().toISOString(),
      items: [
        { brandId: '65af1b2c3d4e5f6a7b8c9d01', quantity: 10, rateSnapShot: 15.5 }, // 10 * 15.5 = 155
        { brandId: '65af1b2c3d4e5f6a7b8c9d02',  quantity: 5,  rateSnapShot: 20.0 }  // 5 * 20.0 = 100
      ]
    };
    // Expected totalBillValue should be 255

    const createResponse = await fetch(`${BASE_URL}/api/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockBillPayload)
    });

    if (createResponse.ok || createResponse.status === 201) {
      const createdBill = await createResponse.json();
      console.log(`✅ Successfully created/updated draft bill (Status: ${createResponse.status}).`);
      console.log(`   Returned Bill ID: ${createdBill._id || 'N/A'}`);
      console.log(`   Status: ${createdBill.status}`);
      console.log(`   Calculated Total Bill Value: ${createdBill.totalBillValue}`);

      // Verify the pre-save middleware calculation if returned
      if (createdBill.totalBillValue === 255) {
        console.log('   ✅ Pre-save totalBillValue calculation works perfectly!');
      } else if (createdBill.totalBillValue === undefined) {
        console.log('   ⚠️ totalBillValue is undefined. The pre-save middleware might not be triggering.');
      } else {
        console.log(`   ❌ Expected totalBillValue to be 255, but got ${createdBill.totalBillValue}`);
      }
    } else {
      console.error(`❌ Failed to create draft bill. HTTP Status: ${createResponse.status}`);
      const errorText = await createResponse.text();
      console.error(`   Error details: ${errorText}`);
    }

    console.log('\n==========================================');
    console.log('   Test Sequence Completed');
    console.log('==========================================');

  } catch (error) {
    console.error('\n❌ Test script encountered a critical error. Is the Node.js server running?');
    console.error(`   ${error.message}`);
    console.log('\n   Please start the server using `npm run dev` or `node src/server.js` and try again.');
  }
}

// Execute the async test workflow
runTests();
