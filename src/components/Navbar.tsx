import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-400 hover:text-blue-300"
          >
            MyApp
          </Link>
          <div className="space-x-8">
            <Link to="/" className="hover:text-blue-400 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-400 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-400 transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
