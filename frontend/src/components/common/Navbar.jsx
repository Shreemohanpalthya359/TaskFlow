import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import logo from "../../assets/images/common/logo.png"
import { AuthContext } from "../../context/AuthContext"

function Navbar() {
  const auth = useContext(AuthContext) || {};
  const { user, logout } = auth;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="TaskFlow logo" className="h-8" />
          <span className="text-white text-2xl font-bold">TaskFlow</span>
        </Link>

        {/* If user is not authenticated show landing links, otherwise show minimal dashboard nav */}
        {!user ? (
          <nav className="hidden md:flex items-center gap-8 text-white">
            <a href="#features" className="opacity-90 hover:opacity-100">Features</a>
            <a href="#how" className="opacity-90 hover:opacity-100">How it Works</a>
            <a href="#pricing" className="opacity-90 hover:opacity-100">Pricing</a>

            <Link to="/login" className="opacity-90 hover:opacity-100">Login</Link>

            <Link to="/signup" className="bg-white text-indigo-600 px-5 py-2 rounded-xl font-medium">Sign Up</Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-4 text-white">
            <Link to="/dashboard" className="opacity-90 hover:opacity-100">Dashboard</Link>
            <button onClick={handleLogout} className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium">Logout</button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar
