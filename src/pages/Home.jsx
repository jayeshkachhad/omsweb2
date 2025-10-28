// src/pages/Home.jsx
import { useAuthStore } from "../store/useAuthStore";

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Logged in as {user?.email}
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}
