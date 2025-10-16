// app/page.tsx
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sarga AI Dashboard</h1>
        <p className="text-gray-600 mb-8">Voice AI Receptionist</p>
        <a 
          href="/dashboard" 
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}