import React, { createContext, useContext, useState } from 'react';
import { signupLecturer, signupStudent, signinLecturer, signinStudent, createClassroom, getAllClassrooms } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate unique IDs for local data
  const generateUniqueId = () => {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateStudentId = () => {
    return `S${Math.floor(10000 + Math.random() * 90000)}`;
  };

  const generateLecturerId = () => {
    return `L${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // Store auth token
  const storeAuthToken = async (token) => {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error storing auth token:', error);
    }
  };

  // Get auth token
  const getAuthToken = async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  };

  // Remove auth token
  const removeAuthToken = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  };

  const signup = async (email, password, name, role, additionalData = {}) => {
    setLoading(true);
    try {
      let response;
      
      if (role === 'lecturer') {
        response = await signupLecturer(name, email, password);
      } else if (role === 'student') {
        response = await signupStudent(name, email, password);
      } else {
        throw new Error('Invalid role specified');
      }

      // Store the auth token if provided in response
      if (response.token) {
        await storeAuthToken(response.token);
      }

      // Create user object from response
      const userData = {
        id: response.lecturer?.id || response.student?.id,
        userId: response.lecturer?.id || response.student?.id,
        email: response.lecturer?.email || response.student?.email,
        name: response.lecturer?.name || response.student?.name,
        role: role,
        joinedClassrooms: [],
        avatar: null,
        bio: '',
        department: role === 'lecturer' ? '' : undefined,
        phone: '',
        ...additionalData
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      let response;
      
      if (role === 'lecturer') {
        response = await signinLecturer(email, password);
      } else if (role === 'student') {
        response = await signinStudent(email, password);
      } else {
        throw new Error('Invalid role specified');
      }

      // Store the auth token
      if (response.token) {
        await storeAuthToken(response.token);
      }

      // Create user object from response
      const userData = {
        id: response.lecturer?.id || response.student?.id,
        userId: response.lecturer?.id || response.student?.id,
        email: response.lecturer?.email || response.student?.email,
        name: response.lecturer?.name || response.student?.name,
        role: role,
        joinedClassrooms: [],
        avatar: null,
        bio: '',
        department: role === 'lecturer' ? '' : undefined,
        phone: ''
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeAuthToken();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const joinClassroom = (classroomCode) => {
    if (user && !user.joinedClassrooms.includes(classroomCode)) {
      const updatedUser = {
        ...user,
        joinedClassrooms: [...user.joinedClassrooms, classroomCode]
      };
      setUser(updatedUser);

      // Update in users array
      setUsers(prev => prev.map(u =>
        u.id === user.id ? updatedUser : u
      ));
    }
  };

  const addClassroom = async (newClassroom) => {
    setLoading(true);
    try {
      console.log('AuthContext: Creating classroom with data:', newClassroom);
      
      // Call the real API to create classroom
      const response = await createClassroom(
        newClassroom.name, 
        newClassroom.description || '', 
        newClassroom.code
      );

      console.log('AuthContext: Received response:', response);

      // Add the classroom from API response to local state
      const classroomWithId = {
        id: response.classroom?.id || generateUniqueId(),
        name: response.classroom?.class_name || newClassroom.name,
        code: response.classroom?.classroom_code || newClassroom.code,
        description: response.classroom?.class_details || newClassroom.description,
        studentCount: 0, // This might come from API in the future
        ...response.classroom
      };
      
      console.log('AuthContext: Adding classroom to local state:', classroomWithId);
      setClassrooms(prev => [...prev, classroomWithId]);
      return classroomWithId;
    } catch (error) {
      console.error('Add classroom error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      console.log('AuthContext: Fetching classrooms for user:', user?.name);
      const response = await getAllClassrooms();
      console.log('AuthContext: Raw API response:', response);
      
      // Transform API response to match local state structure
      const transformedClassrooms = response.classrooms?.map(classroom => ({
        id: classroom.id,
        name: classroom.class_name,
        code: classroom.classroom_code,
        description: classroom.class_details,
        studentCount: classroom.student_count || 0,
        created_at: classroom.created_at,
        updated_at: classroom.updated_at
      })) || [];
      
      console.log('AuthContext: Transformed classrooms:', transformedClassrooms);
      setClassrooms(transformedClassrooms);
      return transformedClassrooms;
    } catch (error) {
      console.error('Fetch classrooms error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteClassroom = (classroomId) => {
    setClassrooms(prev => prev.filter(classroom => classroom.id !== classroomId));
    // Also delete all assignments and submissions for this classroom
    setAssignments(prev => prev.filter(assignment => assignment.classroomId !== classroomId));
    setSubmissions(prev => prev.filter(submission => submission.classroomId !== classroomId));
  };

  const addAssignment = (newAssignment) => {
    const assignmentWithId = {
      ...newAssignment,
      id: generateUniqueId(),
      submissions: 0 // Initialize submission count
    };
    setAssignments(prev => [...prev, assignmentWithId]);
  };

  const deleteAssignment = (assignmentId) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
    // Also delete all submissions for this assignment
    setSubmissions(prev => prev.filter(submission => submission.assignmentId !== assignmentId));
  };

  const addSubmission = (submissionData) => {
    const newSubmission = {
      id: generateUniqueId(),
      ...submissionData,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    setSubmissions(prev => [...prev, newSubmission]);

    // Update assignment submission count
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === submissionData.assignmentId
          ? { ...assignment, submissions: (assignment.submissions || 0) + 1 }
          : assignment
      )
    );

    return newSubmission;
  };

  const getSubmissionsForAssignment = (assignmentId) => {
    return submissions.filter(submission => submission.assignmentId === assignmentId);
  };

  const updateSubmissionWithEvaluation = (submissionId, evaluation) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === submissionId
          ? { ...submission, evaluation, status: 'evaluated' }
          : submission
      )
    );
  };

  const getSubmissionEvaluation = (submissionId) => {
    return submissions.find(sub => sub.id === submissionId)?.evaluation || null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      classrooms,
      assignments,
      submissions,
      loading,
      signup,
      login,
      logout,
      joinClassroom,
      addClassroom,
      fetchClassrooms,
      deleteClassroom,
      addAssignment,
      deleteAssignment,
      addSubmission,
      getSubmissionsForAssignment,
      updateSubmissionWithEvaluation,
      getSubmissionEvaluation,
      getAuthToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};