

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AdminRegister from "./AdminRegister";
import AdminLogin from "./AdminLogin";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister"
import PatientRegister from "./PatientRegister";
import PatientLogin from "./PatientLogin";
import PatientLogout from "./PatientLogout";
import UserLogout from "./UserLogout";
import UploadPdf from "./UploadPdf";
import User from "./User";
import Admin from "./Admin";
import './index.css';



function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/user/register" element={<UserRegister/>} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/logout" element={<UserLogout />} />
        <Route path="/patient/register" element={<PatientRegister/>} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/logout" element={<PatientLogout />} />
        <Route path="/patient/upload" element={<UploadPdf />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
