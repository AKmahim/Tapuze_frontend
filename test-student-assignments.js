/**
 * Test script for student assignment fetching functionality
 * This script tests the new getAssignmentsByClassroomCode API function
 */

const CONFIG = require('./config/api');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const API_BASE_URL = CONFIG.API_BASE_URL;

// Mock auth token getter
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Test function for getAssignmentsByClassroomCode
const testGetAssignmentsByClassroomCode = async (classroomCode) => {
  try {
    console.log('Testing assignment fetch for classroom code:', classroomCode);
    console.log('API URL:', `${API_BASE_URL}/classrooms/code/${classroomCode}/assignments`);
    
    const token = await getAuthToken();
    console.log('Using token:', token ? `${token.substring(0, 20)}...` : 'No token found');
    
    const response = await fetch(`${API_BASE_URL}/classrooms/code/${classroomCode}/assignments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Validate response structure
    if (data.assignments && Array.isArray(data.assignments)) {
      console.log('✅ Valid response structure');
      console.log(`📚 Found ${data.assignments.length} assignments`);
      
      data.assignments.forEach((assignment, index) => {
        console.log(`Assignment ${index + 1}:`);
        console.log(`  - ID: ${assignment.id}`);
        console.log(`  - Title: ${assignment.assignment_title}`);
        console.log(`  - Details: ${assignment.assignment_details}`);
        console.log(`  - Due Date: ${assignment.due_date}`);
        console.log(`  - Classroom ID: ${assignment.classroom_id}`);
        if (assignment.lecturer) {
          console.log(`  - Lecturer: ${assignment.lecturer.name} (${assignment.lecturer.email})`);
        }
        if (assignment.classroom) {
          console.log(`  - Classroom: ${assignment.classroom.class_name} (${assignment.classroom.classroom_code})`);
        }
      });
    } else {
      console.log('❌ Invalid response structure - expected assignments array');
    }

    return data;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
};

// Export for use in other modules
module.exports = {
  testGetAssignmentsByClassroomCode
};

// If this script is run directly, you can uncomment the following to test:
// (async () => {
//   try {
//     await testGetAssignmentsByClassroomCode('P2007D'); // Replace with actual classroom code
//   } catch (error) {
//     console.error('Test failed:', error.message);
//   }
// })();
