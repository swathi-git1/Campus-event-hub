import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import GoogleAccountChooser from './pages/auth/GoogleAccountChooser'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'
import MultiLinker from './pages/MultiLinker'

// Student
import StudentDashboard from './pages/student/Dashboard'
import Enroll from './pages/student/Enroll'
import EventDetail from './pages/student/EventDetail'
import Confirmation from './pages/student/Confirmation'
import MyRegistrations from './pages/student/MyRegistrations'
import Clubs from './pages/student/Clubs'
import ClubProfile from './pages/student/ClubProfile'
import StudentAchievements from './pages/student/Achievements'
import Feedback from './pages/student/Feedback'
import StudentProfile from './pages/student/Profile'
import StudentPermissions from './pages/student/StudentPermissions'
import StudentParticipationHistory from './pages/student/StudentParticipationHistory'

// Instructor
import InstructorDashboard from './pages/instructor/Dashboard'
import ManageEvents from './pages/instructor/ManageEvents'
import CheckIn from './pages/instructor/CheckIn'
import PostAchievement from './pages/instructor/PostAchievement'
import ManageMemberships from './pages/instructor/ManageMemberships'
import InstructorProfile from './pages/instructor/Profile'

// Faculty OD / Permission In-Charge
import ODDashboard from './pages/od_incharge/ODDashboard'
import ODAnalytics from './pages/od_incharge/ODAnalytics'
import ODRequests from './pages/od_incharge/ODRequests'
import ODProofVerification from './pages/od_incharge/ODProofVerification'
import ODRecordsArchive from './pages/od_incharge/ODRecordsArchive'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import PendingClubs from './pages/admin/PendingClubs'
import AdminProfile from './pages/admin/Profile'
import AdminPermissions from './pages/admin/AdminPermissions'
import AIAssistant from './components/AIAssistant'

export default function App() {
  return (
    <>
      <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/:role" element={<Register />} />
      <Route path="/auth/google-choose-account" element={<GoogleAccountChooser />} />
      <Route path="/auth/google" element={<GoogleAccountChooser />} />

      {/* Student */}
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/enroll" element={<ProtectedRoute role="student"><Enroll /></ProtectedRoute>} />
      <Route path="/student/enroll/:id" element={<ProtectedRoute role="student"><EventDetail /></ProtectedRoute>} />
      <Route path="/student/permissions" element={<ProtectedRoute role="student"><StudentPermissions /></ProtectedRoute>} />
      <Route path="/student/history" element={<ProtectedRoute role="student"><StudentParticipationHistory /></ProtectedRoute>} />
      <Route path="/student/confirmation" element={<ProtectedRoute role="student"><Confirmation /></ProtectedRoute>} />
      <Route path="/student/registrations" element={<ProtectedRoute role="student"><MyRegistrations /></ProtectedRoute>} />
      <Route path="/student/clubs" element={<ProtectedRoute role="student"><Clubs /></ProtectedRoute>} />
      <Route path="/student/clubs/:name" element={<ProtectedRoute role="student"><ClubProfile /></ProtectedRoute>} />
      <Route path="/student/achievements" element={<ProtectedRoute role="student"><StudentAchievements /></ProtectedRoute>} />
      <Route path="/student/feedback" element={<ProtectedRoute role="student"><Feedback /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

      {/* Instructor */}
      <Route path="/instructor/dashboard" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
      <Route path="/instructor/events" element={<ProtectedRoute role="instructor"><ManageEvents /></ProtectedRoute>} />
      <Route path="/instructor/checkin" element={<ProtectedRoute role="instructor"><CheckIn /></ProtectedRoute>} />
      <Route path="/instructor/achievements" element={<ProtectedRoute role="instructor"><PostAchievement /></ProtectedRoute>} />
      <Route path="/instructor/memberships" element={<ProtectedRoute role="instructor"><ManageMemberships /></ProtectedRoute>} />
      <Route path="/instructor/profile" element={<ProtectedRoute role="instructor"><InstructorProfile /></ProtectedRoute>} />

      {/* Faculty OD / Permission In-Charge */}
      <Route path="/od-incharge/dashboard" element={<ProtectedRoute role="faculty_od"><ODDashboard /></ProtectedRoute>} />
      <Route path="/od-incharge/analytics" element={<ProtectedRoute role="faculty_od"><ODAnalytics /></ProtectedRoute>} />
      <Route path="/od-incharge/requests" element={<ProtectedRoute role="faculty_od"><ODRequests /></ProtectedRoute>} />
      <Route path="/od-incharge/proofs" element={<ProtectedRoute role="faculty_od"><ODProofVerification /></ProtectedRoute>} />
      <Route path="/od-incharge/records" element={<ProtectedRoute role="faculty_od"><ODRecordsArchive /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/permissions" element={<ProtectedRoute role="admin"><AdminPermissions /></ProtectedRoute>} />
      <Route path="/admin/clubs" element={<ProtectedRoute role="admin"><PendingClubs /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} />

      {/* Universal Protected Settings & Campus Multi-Linker */}
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/links" element={<ProtectedRoute><MultiLinker /></ProtectedRoute>} />
      <Route path="/student/settings" element={<ProtectedRoute role="student"><Settings /></ProtectedRoute>} />
      <Route path="/instructor/settings" element={<ProtectedRoute role="instructor"><Settings /></ProtectedRoute>} />
      <Route path="/od-incharge/settings" element={<ProtectedRoute role="faculty_od"><Settings /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><Settings /></ProtectedRoute>} />
      <Route path="/student/links" element={<ProtectedRoute role="student"><MultiLinker /></ProtectedRoute>} />
      <Route path="/instructor/links" element={<ProtectedRoute role="instructor"><MultiLinker /></ProtectedRoute>} />
      <Route path="/od-incharge/links" element={<ProtectedRoute role="faculty_od"><MultiLinker /></ProtectedRoute>} />
      <Route path="/admin/links" element={<ProtectedRoute role="admin"><MultiLinker /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
    <AIAssistant />
  </>
  )
}
