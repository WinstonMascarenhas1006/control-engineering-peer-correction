import Link from 'next/link'
import InertiaCarousel from '@/components/InertiaCarousel'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Inertia Carousel */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
        <InertiaCarousel />
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Peer Correction Lookup
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect with your peer corrector. Register your details and find who's correcting your paper.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-4">
            <Link
              href="/register"
              className="block w-full text-center bg-blue-600 text-white py-4 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Register / Update
            </Link>
            <Link
              href="/lookup"
              className="block w-full text-center bg-green-600 text-white py-4 px-6 rounded-md hover:bg-green-700 transition-colors font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Lookup Corrector
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Quick and easy peer correction management for university students
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

