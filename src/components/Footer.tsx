export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-8">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-gray-400 mb-2">© 2025 MyApp. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-blue-400">
            Privacy
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400">
            Terms
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
