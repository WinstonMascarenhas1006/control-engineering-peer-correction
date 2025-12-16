'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    myMatriculationNumber: '',
    paperReceivedMatriculationNumber: '',
    name: '',
    email: '',
    whatsappNumber: '',
    consent: false,
  })
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.myMatriculationNumber.trim()) {
      newErrors.myMatriculationNumber = 'Matriculation number is required'
    }

    if (!formData.paperReceivedMatriculationNumber.trim()) {
      newErrors.paperReceivedMatriculationNumber = 'Paper received matriculation number is required'
    }

    if (formData.myMatriculationNumber === formData.paperReceivedMatriculationNumber) {
      newErrors.paperReceivedMatriculationNumber = 'Cannot be the same as your matriculation number'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required'
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      newErrors.whatsappNumber = 'Invalid WhatsApp number format (include country code, e.g., +1234567890)'
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to share your contact information'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (honeypot) {
      return // Bot detected, silently fail
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          myMatriculationNumber: formData.myMatriculationNumber.trim(),
          paperReceivedMatriculationNumber: formData.paperReceivedMatriculationNumber.trim(),
          name: formData.name.trim() || null,
          email: formData.email.trim(),
          whatsappNumber: formData.whatsappNumber.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Show specific error message for duplicate matriculation numbers
        const errorMessage = data.error || 'Registration failed. Please try again.'
        setErrors({ submit: errorMessage })
        
        // If it's a duplicate error, also highlight the matriculation number field
        if (response.status === 409 && errorMessage.includes('already registered')) {
          setErrors({ 
            submit: errorMessage,
            myMatriculationNumber: 'This matriculation number is already registered'
          })
        }
        
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/lookup')
      }, 2000)
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
      setIsSubmitting(false)
    }
  }


  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Success!</h2>
          <p className="text-gray-600 mb-6">Your registration has been saved.</p>
          <Link
            href="/lookup"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Lookup
          </Link>
        </div>
      </main>
    )
  }


  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Register / Update</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label htmlFor="myMatriculationNumber" className="block text-sm font-medium text-gray-700 mb-1">
              My Matriculation Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="myMatriculationNumber"
              value={formData.myMatriculationNumber}
              onChange={(e) => setFormData({ ...formData, myMatriculationNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.myMatriculationNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.myMatriculationNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="paperReceivedMatriculationNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Matriculation Number on Paper I Received <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="paperReceivedMatriculationNumber"
              value={formData.paperReceivedMatriculationNumber}
              onChange={(e) => setFormData({ ...formData, paperReceivedMatriculationNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.paperReceivedMatriculationNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.paperReceivedMatriculationNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.whatsappNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
            )}
          </div>

          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1 mr-2"
                required
              />
              <span className="text-sm text-gray-700">
                I agree to share my email and WhatsApp number with the student whose paper I am correcting and the student correcting my paper. <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.consent && (
              <p className="mt-1 text-sm text-red-600">{errors.consent}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/lookup" className="text-sm text-blue-600 hover:underline">
            Already registered? Lookup your corrector
          </Link>
        </div>
      </div>
    </main>
  )
}

