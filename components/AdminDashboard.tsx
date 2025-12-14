'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from './BackButton'

interface Student {
  id: string
  myMatriculationNumber: string
  paperReceivedMatriculationNumber: string
  name: string | null
  email: string
  whatsappNumber: string
  consentGivenAt: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [error, setError] = useState('')

  const fetchRoster = async () => {
    try {
      const response = await fetch('/api/admin/roster')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to fetch roster')
      }

      const data = await response.json()
      setStudents(data)
      setFilteredStudents(data)
      setError('')
    } catch (err) {
      setError('Failed to load roster. Please refresh the page.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoster()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchRoster()
      }, 8000) // 8 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredStudents(
        students.filter(
          (s) =>
            s.myMatriculationNumber.toLowerCase().includes(term) ||
            s.paperReceivedMatriculationNumber.toLowerCase().includes(term) ||
            s.email.toLowerCase().includes(term) ||
            (s.name && s.name.toLowerCase().includes(term))
        )
      )
    }
  }, [searchTerm, students])

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/export.xlsx')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to export')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `peer-correction-roster-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert('Failed to export Excel file. Please try again.')
      console.error(err)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (err) {
      router.push('/admin/login')
    }
  }

  if (isLoading) {
    return (
      <main 
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: 'url(/adminbg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-transparent mb-4"></div>
              <p className="text-slate-700 font-medium">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative admin-dashboard-bg"
      style={{
        backgroundImage: 'url(/adminbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-white/92 backdrop-blur-[2px] z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-6 text-white border border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-blue-100 text-sm">Control Engineering - Manage student registrations and exports</p>
            </div>
            <div className="flex gap-3">
              <BackButton href="/" label="Home" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all font-medium backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Controls Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 border border-white/30">

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by matriculation number, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all bg-white/80"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-5 py-3 rounded-lg hover:from-slate-800 hover:to-slate-900 transition-all font-medium shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Excel
              </button>
              <button
                onClick={fetchRoster}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-5 py-3 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-5 h-5 text-slate-700 rounded focus:ring-2 focus:ring-slate-500"
              />
              <label htmlFor="autoRefresh" className="text-sm font-medium text-slate-700 cursor-pointer">
                Auto-refresh (every 8 seconds)
              </label>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                <span className="text-slate-600">Total: <strong className="text-slate-900">{students.length}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                <span className="text-slate-600">Showing: <strong className="text-slate-900">{filteredStudents.length}</strong></span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-slate-100/90 to-slate-200/90 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    My Matric #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Paper Received Matric #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Consent Given
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-800 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 font-medium">No registrations found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/70 transition-colors border-b border-slate-100/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900 bg-slate-100/80 px-2 py-1 rounded">
                          {student.myMatriculationNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900 bg-slate-200/80 px-2 py-1 rounded">
                          {student.paperReceivedMatriculationNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                        {student.name || <span className="text-slate-400 italic">Not provided</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href={`mailto:${student.email}`}
                          className="text-sm text-slate-700 hover:text-slate-900 hover:underline font-medium"
                        >
                          {student.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://wa.me/${student.whatsappNumber.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-slate-700 hover:text-slate-900 hover:underline flex items-center gap-1 font-medium"
                        >
                          {student.whatsappNumber}
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(student.consentGivenAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-slate-500">
                          {new Date(student.consentGivenAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(student.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-slate-500">
                          {new Date(student.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(student.updatedAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-slate-500">
                          {new Date(student.updatedAt).toLocaleTimeString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

