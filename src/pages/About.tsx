export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-teal-600">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">About Page</h1>
        <p className="text-lg mb-8">
          This is the about page. Here you can add information about your
          project or organization.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
