import CreateEvent from "./pages/CreateEvent";
import AdminUsers from "./pages/AdminUsers";
import AttendanceCheckIn from "./pages/AttendanceCheckIn";
import AttendanceViewer from "./pages/AttendanceViewer";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import ViewAnnouncements from "./pages/ViewAnnouncements";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";
import CreateOrganization from "./pages/CreateOrganization";
import ApprovedOrganizations from "./pages/ApprovedOrganizations";
import AdminOrganizations from "./pages/AdminOrganizations";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/checkin" element={<AttendanceCheckIn />} />
        <Route path="/attendance" element={<AttendanceViewer />} />
        <Route path="/announcements/create" element={<CreateAnnouncement />} />
        <Route path="/announcements/view" element={<ViewAnnouncements />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/teams/join" element={<JoinTeam />} />
        <Route path="/organizations/create" element={<CreateOrganization />} />
        <Route
          path="/organizations/approved"
          element={<ApprovedOrganizations />}
        />
        <Route path="/admin/organizations" element={<AdminOrganizations />} />
      </Routes>
    </BrowserRouter>
  );
}
