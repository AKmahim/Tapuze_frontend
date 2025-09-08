// API Service for handling backend communication
import CONFIG from '../config/api';

const API_BASE_URL = CONFIG.API_BASE_URL;

// Authentication API functions
export const signupLecturer = async (name, email, password) => {
  try {
    console.log('Attempting lecturer signup to:', `${API_BASE_URL}/lecturers/signup`);
    const response = await fetch(`${API_BASE_URL}/lecturers/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Lecturer signup failed:', error);
    if (error.message === 'Network request failed') {
      throw new Error('Cannot connect to server. Please check your internet connection and ensure the backend server is running.');
    }
    throw new Error(error.message || 'Failed to create lecturer account. Please try again.');
  }
};

export const signupStudent = async (name, email, password) => {
  try {
    console.log('Attempting student signup to:', `${API_BASE_URL}/students/signup`);
    const response = await fetch(`${API_BASE_URL}/students/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Student signup failed:', error);
    if (error.message === 'Network request failed') {
      throw new Error('Cannot connect to server. Please check your internet connection and ensure the backend server is running.');
    }
    throw new Error(error.message || 'Failed to create student account. Please try again.');
  }
};

export const signinLecturer = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lecturers/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Lecturer signin failed:', error);
    throw new Error(error.message || 'Failed to sign in. Please check your credentials.');
  }
};

export const signinStudent = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Student signin failed:', error);
    throw new Error(error.message || 'Failed to sign in. Please check your credentials.');
  }
};

// Classroom Management API functions
export const createClassroom = async (className, classDetails, classroomCode) => {
  try {
    console.log('Attempting to create classroom:', `${API_BASE_URL}/classrooms`);
    const token = await getAuthToken();
    console.log('Token being used:', token ? `${token.substring(0, 20)}...` : 'No token found');
    console.log('Request payload:', { class_name: className, class_details: classDetails, classroom_code: classroomCode });
    
    const response = await fetch(`${API_BASE_URL}/classrooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        class_name: className,
        class_details: classDetails,
        classroom_code: classroomCode
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Create classroom failed:', error);
    if (error.message === 'Network request failed') {
      throw new Error('Cannot connect to server. Please check your internet connection and ensure the backend server is running.');
    }
    throw new Error(error.message || 'Failed to create classroom. Please try again.');
  }
};

export const getAllClassrooms = async () => {
  try {
    console.log('Fetching all classrooms:', `${API_BASE_URL}/classrooms`);
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/classrooms`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Get classrooms failed:', error);
    if (error.message === 'Network request failed') {
      throw new Error('Cannot connect to server. Please check your internet connection and ensure the backend server is running.');
    }
    throw new Error(error.message || 'Failed to fetch classrooms. Please try again.');
  }
};

// Mock function for AI grading - replace with actual API call
export const gradeHomeworkWithAI = async (fileData) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response - replace with actual API call
    const mockResponse = {
      overall_score: 85,
      problem_breakdown: [
        {
          problem_description: { en: 'Problem 1: Basic Calculation', he: 'שאלה 1: חישוב בסיסי' },
          score: 20,
          max_score: 25,
          feedback: { 
            en: 'Good work on the basic calculation, but there are some minor errors.',
            he: 'עבודה טובה על החישוב הבסיסי, אך יש כמה שגיאות קטנות.'
          },
          teacher_recommendation: { 
            en: 'Review the calculation steps carefully.',
            he: 'בדוק את שלבי החישוב בקפידה.'
          },
          errors: [
            {
              error_type: 'minor_slip',
              deduction: 5,
              explanation: { 
                en: 'Minor calculation error in step 2.',
                he: 'שגיאת חישוב קטנה בשלב 2.'
              },
              hint: { 
                en: 'Double-check your arithmetic.',
                he: 'בדוק שוב את החשבון שלך.'
              },
              boundingBox: { x: 0.1, y: 0.2, width: 0.3, height: 0.1 }
            }
          ]
        },
        {
          problem_description: { en: 'Problem 2: Word Problem', he: 'שאלה 2: בעיית מילים' },
          score: 22,
          max_score: 25,
          feedback: { 
            en: 'Excellent understanding of the word problem.',
            he: 'הבנה מעולה של בעיית המילים.'
          },
          teacher_recommendation: { 
            en: 'Keep up the good work!',
            he: 'המשך בעבודה הטובה!'
          },
          errors: []
        }
      ]
    };
    
    return mockResponse;
  } catch (error) {
    console.error('AI grading failed:', error);
    throw new Error('Failed to get AI evaluation. Please try again.');
  }
};

// Mock function for updating submission evaluation - replace with actual API call
export const updateSubmissionEvaluation = async (classroomId, assignmentId, submissionId, evaluation) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const token = await getAuthToken();
    // Mock API call - replace with actual implementation
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${submissionId}/evaluation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(evaluation)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to update submission evaluation:', error);
    throw new Error('Failed to save evaluation. Please try again.');
  }
};

// Helper function to get auth token (implement based on your auth system)
const getAuthToken = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

// Additional API functions you might need:

export const getSubmissions = async (classroomId, assignmentId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}/submissions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    throw error;
  }
};

export const getAssignment = async (classroomId, assignmentId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};

export const getClassroom = async (classroomId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch classroom:', error);
    throw error;
  }
};
