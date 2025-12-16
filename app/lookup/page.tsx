'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CorrectorInfo {
  name: string | null
  email: string
  whatsappNumber: string
  myMatriculationNumber: string
}

export default function LookupPage() {
  const [matriculationNumber, setMatriculationNumber] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [corrector, setCorrector] = useState<CorrectorInfo | null>(null)
  const [myPaperInfo, setMyPaperInfo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showMatric, setShowMatric] = useState(false)
  const [notRegistered, setNotRegistered] = useState(false)
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCorrector(null)
    setMyPaperInfo(null)
    setNotRegistered(false)
    setShowMatric(false)
    setShowSecurityQuestion(false)

    if (!matriculationNumber.trim()) {
      setError('Please enter your matriculation number')
      return
    }

    // If security question is shown, verify the answer
    if (showSecurityQuestion) {
      if (!securityAnswer.trim()) {
        setError('Please answer the security question')
        return
      }

      setIsLoading(true)

      try {
        const response = await fetch('/api/lookup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            matriculationNumber: matriculationNumber.trim(),
            securityAnswer: securityAnswer.trim(),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (data.error === 'INVALID_SECURITY_ANSWER') {
            setError(data.message || 'Incorrect security answer. Please try again.')
            setSecurityAnswer('') // Clear the answer field
          } else if (data.error === 'NOT_REGISTERED') {
            setNotRegistered(true)
            setShowSecurityQuestion(false)
            setSecurityQuestion(null)
          } else {
            setError(data.error || 'Lookup failed. Please try again.')
          }
          setIsLoading(false)
          return
        }

        // Success - show corrector information
        if (data.corrector) {
          setCorrector(data.corrector)
        }

        if (data.myPaperInfo) {
          setMyPaperInfo(data.myPaperInfo)
        }

        setShowSecurityQuestion(false)
        setIsLoading(false)
      } catch (error) {
        setError('Network error. Please try again.')
        setIsLoading(false)
      }
      return
    }

    // First step: Get security question
    setIsLoading(true)

    try {
      const response = await fetch('/api/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matriculationNumber: matriculationNumber.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'NOT_REGISTERED') {
          setNotRegistered(true)
        } else {
          setError(data.error || 'Lookup failed. Please try again.')
        }
        setIsLoading(false)
        return
      }

      // If security question is returned, show it
      if (data.requiresSecurityAnswer && data.securityQuestion) {
        setSecurityQuestion(data.securityQuestion)
        setShowSecurityQuestion(true)
        setIsLoading(false)
        return
      }

      // If corrector info is returned directly (shouldn't happen, but handle it)
      if (data.corrector) {
        setCorrector(data.corrector)
      }

      if (data.myPaperInfo) {
        setMyPaperInfo(data.myPaperInfo)
      }

      setIsLoading(false)
    } catch (error) {
      setError('Network error. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Lookup Your Corrector</h1>
        
        <form onSubmit={handleLookup} className="space-y-4 mb-6">
          <div>
            <label htmlFor="matriculationNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Your Matriculation Number
            </label>
            <input
              type="text"
              id="matriculationNumber"
              value={matriculationNumber}
              onChange={(e) => {
                setMatriculationNumber(e.target.value)
                // Reset security question if matric number changes
                if (showSecurityQuestion) {
                  setShowSecurityQuestion(false)
                  setSecurityQuestion(null)
                  setSecurityAnswer('')
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ABC123456"
              required
              disabled={showSecurityQuestion}
            />
          </div>

          {showSecurityQuestion && securityQuestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700 mb-2">
                Security Question:
              </label>
              <p className="text-sm font-semibold text-gray-900 mb-3">{securityQuestion}</p>
              <input
                type="text"
                id="securityAnswer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your answer"
                required
                autoFocus
              />
              {error && error.includes('security answer') && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading 
              ? (showSecurityQuestion ? 'Verifying...' : 'Looking up...') 
              : (showSecurityQuestion ? 'Verify & Continue' : 'Lookup')
            }
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {notRegistered && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <p className="text-sm text-yellow-800 mb-3">
              You are not registered yet. Please register first.
            </p>
            <Link
              href="/register"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Go to Registration
            </Link>
          </div>
        )}

        {corrector ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Corrector</h2>
            <p className="text-sm text-gray-600 mb-3">
              The following person has your paper for correction:
            </p>
            <div className="space-y-2 text-sm">
              {corrector.name && (
                <p>
                  <span className="font-medium">Name:</span> {corrector.name}
                </p>
              )}
              <p>
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${corrector.email}`} className="text-blue-600 hover:underline">
                  {corrector.email}
                </a>
              </p>
              <p>
                <span className="font-medium">WhatsApp:</span>{' '}
                <a
                  href={`https://wa.me/${corrector.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {corrector.whatsappNumber}
                </a>
              </p>
              <div>
                <button
                  onClick={() => setShowMatric(!showMatric)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {showMatric ? 'Hide' : 'Show'} Corrector&apos;s Matriculation Number
                </button>
                {showMatric && (
                  <p className="mt-1">
                    <span className="font-medium">Matriculation Number:</span> {corrector.myMatriculationNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : myPaperInfo && !isLoading && !error && !notRegistered ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Corrector Found</h2>
            <p className="text-sm text-yellow-800">
              No one has registered as your corrector yet. The person who received your paper (matriculation number: <strong>{matriculationNumber}</strong>) has not registered in the system.
            </p>
            <p className="text-sm text-yellow-700 mt-2">
              Please check again later, or contact your instructor if you believe someone should have registered by now.
            </p>
          </div>
        ) : null}

        {myPaperInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You are correcting the paper of student with matriculation number: <strong>{myPaperInfo}</strong>
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/register" className="text-sm text-blue-600 hover:underline">
            Need to register or update? Click here
          </Link>
        </div>
      </div>
    </main>
  )
}

