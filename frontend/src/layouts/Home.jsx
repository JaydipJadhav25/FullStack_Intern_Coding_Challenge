import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Store Rating System
        </h1>

        <p className="text-gray-600 mb-8">
          Discover stores, submit ratings, and share your experience.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;