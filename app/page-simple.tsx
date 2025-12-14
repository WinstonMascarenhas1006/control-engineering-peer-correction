import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Peer Correction Lookup
        </h1>
        <div className="space-y-4">
          <Link
            href="/register"
            className="block w-full text-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register / Update
          </Link>
          <Link
            href="/lookup"
            className="block w-full text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Lookup Corrector
          </Link>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          Server is running! If you see this, the app is working.
        </div>
      </div>
    </main>
  )
}

