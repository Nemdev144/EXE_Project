export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome to Home</h1>
        <p className="text-xl mb-8">This is the home page</p>
        <div className="space-x-4">
          <a
            href="/about"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Go to About
          </a>
          <a
            href="/contact"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Go to Contact
          </a>
        </div>
      </div>
    </div>
  );
}
