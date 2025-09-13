// Test script for Get Classroom by Code API
// This is a simple test script to verify the API implementation

import { getClassroomByCode } from './services/apiService';

const testGetClassroomByCode = async () => {
  try {
    console.log('Testing Get Classroom by Code API...');
    
    // Test with a sample classroom code
    const testCode = 'MATH101';
    
    console.log(`Attempting to fetch classroom with code: ${testCode}`);
    const result = await getClassroomByCode(testCode);
    
    console.log('API Response:', JSON.stringify(result, null, 2));
    
    if (result && result.classroom) {
      console.log('✅ API call successful!');
      console.log('Classroom details:');
      console.log(`- Name: ${result.classroom.class_name}`);
      console.log(`- Code: ${result.classroom.classroom_code}`);
      console.log(`- Description: ${result.classroom.class_details}`);
      console.log(`- ID: ${result.classroom.id}`);
    } else {
      console.log('❌ Unexpected response structure');
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    
    if (error.message.includes('Cannot connect to server')) {
      console.log('💡 Make sure the backend server is running on the configured URL');
    } else if (error.message.includes('Classroom not found')) {
      console.log('💡 Try using a valid classroom code that exists in your database');
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.log('💡 Make sure you are logged in and have a valid authentication token');
    }
  }
};

const testWithInvalidCode = async () => {
  try {
    console.log('\nTesting with invalid classroom code...');
    const invalidCode = 'INVALID123';
    
    console.log(`Attempting to fetch classroom with invalid code: ${invalidCode}`);
    const result = await getClassroomByCode(invalidCode);
    
    console.log('❌ Expected this to fail, but it succeeded:', result);
    
  } catch (error) {
    console.log('✅ Correctly failed for invalid code:', error.message);
  }
};

// Export test functions for use in the app
export { testGetClassroomByCode, testWithInvalidCode };

// If running this file directly (for testing purposes)
if (require.main === module) {
  console.log('Running classroom API tests...\n');
  
  testGetClassroomByCode()
    .then(() => testWithInvalidCode())
    .then(() => console.log('\n✅ All tests completed'))
    .catch(error => console.error('\n❌ Test execution failed:', error));
}
