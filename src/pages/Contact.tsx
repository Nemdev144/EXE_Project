export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-red-600">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">Contact Page</h1>
        <p className="text-lg mb-8">
          Get in touch with us for any inquiries or support.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:bg-gray-100"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
