# Assignment API Implementation - Testing Guide

## Overview
Implemented the complete assignment management API integration:

1. **Backend API Functions**:
   - `createAssignment()` - Create new assignment in a classroom
   - `getAllAssignments()` - Fetch all assignments for a classroom

2. **Frontend Integration**:
   - Updated `AuthContext` with API-integrated assignment functions
   - Enhanced `CreateAssignment` screen with async API calls
   - Enhanced `ClassroomScreen` with automatic assignment fetching
   - Added pull-to-refresh functionality

## API Endpoints Used

### Create Assignment
```
POST /api/classrooms/{classroomId}/assignments
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "assignment_title": "Homework 1: Derivatives",
  "assignment_details": "Complete problems 1-15 from chapter 3...",
  "due_date": "2025-09-20T23:59:59.000Z"
}
```

### Get All Assignments
```
GET /api/classrooms/{classroomId}/assignments
Authorization: Bearer {token}
```

## Changes Made

### 1. services/apiService.js
- Added `createAssignment()` function
- Added `getAllAssignments()` function
- Comprehensive error handling and logging

### 2. contexts/AuthContext.js
- Updated `addAssignment()` to use real API
- Added `fetchAssignments()` function
- Enhanced state management for assignments
- Added proper API response transformation

### 3. screens/CreateAssignment.js
- Made assignment creation async
- Added loading states with ActivityIndicator
- Enhanced error handling
- Improved user feedback

### 4. screens/ClassroomScreen.js
- Added `useEffect` to fetch assignments on component mount
- Added pull-to-refresh functionality
- Enhanced loading states
- Automatic assignment fetching when classroom changes

## Testing Steps

1. **Start the backend server** (ensure it's running on port 3001)
2. **Sign in as a lecturer**
3. **Navigate to a classroom**
4. **Create a new assignment**:
   - Fill in title and description
   - Set due date
   - Tap "Create Assignment"
   - Verify success message
5. **Verify assignment appears in classroom**:
   - Assignment should appear automatically in the list
   - Pull down to refresh and verify it persists
6. **Test navigation**: Go back to dashboard and return to classroom
7. **Verify persistence**: Assignment should still be visible

## Expected Behavior

### Create Assignment:
- Shows loading spinner during creation
- Displays success message
- Navigates back to classroom automatically
- New assignment appears in classroom list

### View Assignments:
- Assignments load automatically when entering classroom
- Pull-to-refresh updates the list
- Loading states provide user feedback
- Error handling shows helpful messages

## Debugging

If assignments don't appear:

1. **Check Console Logs**:
   - "AuthContext: Creating assignment with data: [data]"
   - "AuthContext: Received assignment response: [response]"
   - "ClassroomScreen: Fetching assignments for classroom: [name]"

2. **Check Network Requests**:
   - POST request to create assignment should return 201
   - GET request should return 200 with assignments array

3. **Check Authentication**:
   - Ensure user is properly logged in
   - Verify JWT token is valid and not expired

## Files Modified
- `/services/apiService.js`
- `/contexts/AuthContext.js`
- `/screens/CreateAssignment.js`
- `/screens/ClassroomScreen.js`
