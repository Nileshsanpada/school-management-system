import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Admin Pages
import Dashboard from '../pages/dashboard/Dashboard'
import AdmissionList from '../pages/admissions/AdmissionList'
import AdmissionForm from '../pages/admissions/AdmissionForm'
import AdmissionDetails from '../pages/admissions/AdmissionDetails'
import StudentList from '../pages/students/StudentList'
import StudentForm from '../pages/students/StudentForm'
import StudentDetails from '../pages/students/StudentDetails'
import AcademicYears from '../pages/academics/AcademicYears'
import Classes from '../pages/academics/Classes'
import Sections from '../pages/academics/Sections'
import Subjects from '../pages/academics/Subjects'
import Teachers from '../pages/academics/Teachers'
import Attendance from '../pages/attendance/Attendance'
import StudentAttendance from '../pages/attendance/StudentAttendance'
import Examinations from '../pages/examinations/Examinations'
import Results from '../pages/examinations/Results'
import Fees from '../pages/fees/Fees'
import Payments from '../pages/fees/Payments'

// Parent Pages
import ParentDashboard from '../pages/parent/ParentDashboard'
import ChildProfile from '../pages/parent/ChildProfile'
import ChildAttendance from '../pages/parent/ChildAttendance'
import ChildResults from '../pages/parent/ChildResults'
import ChildFees from '../pages/parent/ChildFees'

// User Profile Page
import Profile from '../pages/profile/Profile'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'PARENT']}><Profile /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><Dashboard /></ProtectedRoute>} />
      
      <Route path="/admissions" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdmissionList /></ProtectedRoute>} />
      <Route path="/admissions/new" element={<ProtectedRoute allowedRoles={['ADMIN', 'PARENT']}><AdmissionForm /></ProtectedRoute>} />
      <Route path="/admissions/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdmissionDetails /></ProtectedRoute>} />
      
      <Route path="/students" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><StudentList /></ProtectedRoute>} />
      <Route path="/students/:id/edit" element={<ProtectedRoute allowedRoles={['ADMIN']}><StudentForm /></ProtectedRoute>} />
      <Route path="/students/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><StudentDetails /></ProtectedRoute>} />
      
      <Route path="/academic-years" element={<ProtectedRoute allowedRoles={['ADMIN']}><AcademicYears /></ProtectedRoute>} />
      <Route path="/classes" element={<ProtectedRoute allowedRoles={['ADMIN']}><Classes /></ProtectedRoute>} />
      <Route path="/sections" element={<ProtectedRoute allowedRoles={['ADMIN']}><Sections /></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute allowedRoles={['ADMIN']}><Subjects /></ProtectedRoute>} />
      <Route path="/teachers" element={<ProtectedRoute allowedRoles={['ADMIN']}><Teachers /></ProtectedRoute>} />
      
      <Route path="/attendance" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><Attendance /></ProtectedRoute>} />
      <Route path="/attendance/student/:studentId" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><StudentAttendance /></ProtectedRoute>} />
      
      <Route path="/examinations" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><Examinations /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}><Results /></ProtectedRoute>} />
      
      <Route path="/fees" element={<ProtectedRoute allowedRoles={['ADMIN']}><Fees /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute allowedRoles={['ADMIN']}><Payments /></ProtectedRoute>} />
      
      {/* Parent Routes */}
      <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['PARENT']}><ParentDashboard /></ProtectedRoute>} />
      <Route path="/parent/child/:studentId" element={<ProtectedRoute allowedRoles={['PARENT']}><ChildProfile /></ProtectedRoute>} />
      <Route path="/parent/child/:studentId/attendance" element={<ProtectedRoute allowedRoles={['PARENT']}><ChildAttendance /></ProtectedRoute>} />
      <Route path="/parent/child/:studentId/results" element={<ProtectedRoute allowedRoles={['PARENT']}><ChildResults /></ProtectedRoute>} />
      <Route path="/parent/child/:studentId/fees" element={<ProtectedRoute allowedRoles={['PARENT']}><ChildFees /></ProtectedRoute>} />
      
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
