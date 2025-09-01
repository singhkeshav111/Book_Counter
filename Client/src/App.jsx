import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();

  // Hide navbar only on signup & login pages
  const hideNavbar =
    location.pathname === "/signup" || location.pathname === "/loginUser";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={!hideNavbar ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/loginUser" element={<SignIn />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
