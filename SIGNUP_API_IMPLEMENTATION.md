# Signup API Implementation

## Overview
This document outlines the implementation of the signup API integration for both students and lecturers in the Tapuze frontend React Native application.

## Changes Made

### 1. Updated apiService.js
- **File**: `/services/apiService.js`
- **Changes**:
  - Updated `API_BASE_URL` to match backend port (3001)
  - Added `signupLecturer()` function for lecturer registration
  - Added `signupStudent()` function for student registration
  - Added `signinLecturer()` function for lecturer login
  - Added `signinStudent()` function for student login
  - Updated `getAuthToken()` helper to use AsyncStorage instead of localStorage
  - Updated other API functions to use async token retrieval

### 2. Updated AuthContext.js
- **File**: `/contexts/AuthContext.js`
- **Changes**:
  - Added AsyncStorage import for token management
  - Made `signup()` function async and integrated with real API
  - Made `login()` function async and integrated with real API
  - Added loading state management
  - Added token storage functions (`storeAuthToken`, `getAuthToken`, `removeAuthToken`)
  - Added proper error handling for API calls
  - Updated logout to clear stored token

### 3. Updated SignupScreen.js
- **File**: `/screens/SignupScreen.js`
- **Changes**:
  - Made `handleSignup()` function async
  - Added loading state with ActivityIndicator
  - Added input validation (email format, password length)
  - Added proper error handling with user-friendly messages
  - Added disabled state for signup button during loading
  - Updated success handling to navigate to dashboard

### 4. Updated AuthScreen.js
- **File**: `/screens/AuthScreen.js`
- **Changes**:
  - Made `handleLogin()` function async
  - Added loading state with ActivityIndicator
  - Added input validation (email format, required fields)
  - Added proper error handling with user-friendly messages
  - Added disabled state for login button during loading
  - Removed demo text since using real API

## API Endpoints Used

Based on the Postman collection, the following endpoints are integrated:

### Authentication Endpoints
- `POST /api/lecturers/signup` - Register a new lecturer
- `POST /api/students/signup` - Register a new student
- `POST /api/lecturers/signin` - Lecturer login
- `POST /api/students/signin` - Student login

### Request Format
All signup endpoints expect:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "userpassword"
}
```

All signin endpoints expect:
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

### Response Format
Expected response includes:
```json
{
  "token": "jwt_token_here",
  "lecturer": {
    "id": "lecturer_id",
    "name": "Lecturer Name",
    "email": "lecturer@example.com"
  }
}
```
or
```json
{
  "token": "jwt_token_here",
  "student": {
    "id": "student_id", 
    "name": "Student Name",
    "email": "student@example.com"
  }
}
```

## Token Management
- JWT tokens are stored in AsyncStorage with key `authToken`
- Tokens are automatically included in subsequent API requests
- Tokens are cleared on logout

## Validation Added
- Email format validation using regex
- Password minimum length (6 characters)
- Required field validation
- User-friendly error messages

## Loading States
- Loading indicators during API calls
- Disabled buttons to prevent multiple submissions
- Proper error handling with alerts

## Next Steps
1. Test the implementation with the actual backend
2. Make sure backend is running on port 3001
3. Test signup and login flows for both student and lecturer roles
4. Implement additional profile management features if needed

## Dependencies
- `@react-native-async-storage/async-storage` (already installed)
- React Native fetch API for HTTP requests

## Notes
- Make sure your backend server is running on `http://localhost:3001`
- Update the `API_BASE_URL` in `apiService.js` if your backend runs on a different port/URL
- The implementation follows the exact API structure provided in the Postman collection
