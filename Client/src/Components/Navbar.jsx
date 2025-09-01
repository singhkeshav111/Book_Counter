import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Books", path: "/books" },
    { name: "Categories", path: "/categories" },
    { name: "Best Sellers", path: "/bestsellers" },
    { name: "New Arrivals", path: "/new" },
    { name: "Favourites", path: "/favourites" },
    { name: "Cart", path: "/cart" },
  ];

  // Fetch current logged-in user
useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  if (token && storedUser) {
    setUser(JSON.parse(storedUser));
  } else if (token) {
    // fallback: fetch current user
    axios
      .get("http://localhost:4000/api/v1/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null));
  }
}, []);


  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/v1/users/logoutUser", {}, { withCredentials: true });
      localStorage.removeItem("token");
      setUser(null);
      navigate("/"); // redirect home
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-[#f0f0f0] text-[#0F1012] shadow-md rounded-2xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl tracking-wide">BookStore</Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-primary transition ${location.pathname === link.path ? "font-semibold underline underline-offset-4" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 relative">
          {!user ? (
            <Link
              to="/loginUser"
              className="px-5 py-2 bg-primary rounded-full font-medium hover:bg-primary-dull transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
              {isOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white shadow-md rounded-md py-2 text-sm text-red-500 hover:bg-red-50">
                  <button onClick={handleLogout} className="w-full text-left px-3 py-1">Logout</button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>☰</button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && !user && (
        <div className="md:hidden bg-[#f0f0f0] border-t border-gray-300 flex flex-col items-start gap-4 px-6 py-4 rounded-b-2xl">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`hover:text-primary transition ${location.pathname === link.path ? "font-semibold underline underline-offset-4" : ""}`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/loginUser"
            className="px-5 py-2 bg-primary rounded-full font-medium hover:bg-primary-dull transition"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
