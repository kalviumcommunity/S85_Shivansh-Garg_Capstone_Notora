import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import NotesPage from "./pages/NotesPage";
// import PremiumPage from "./pages/PremiumPage";
// import UploadPage from "./pages/UploadPage";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/notes" element={<NotesPage />} /> */}
        {/* <Route path="/premium" element={<PremiumPage />} /> */}
        {/* <Route path="/upload" element={<UploadPage />} /> */}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import NavBar from "./components/Navbar";
// import HomePage from "./pages/HomePage";
// // import NotesPage from "./pages/NotesPage";
// // import UploadPage from "./pages/UploadPage";
// // import PremiumPage from "./pages/PremiumPage";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <NavBar />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         {/* <Route path="/notes" element={<NotesPage />} /> */}
//         {/* <Route path="/upload" element={<UploadPage />} /> */}
//         {/* <Route path="/premium" element={<PremiumPage />} /> */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }
