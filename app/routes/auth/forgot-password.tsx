import { useState } from 'react'
import { Link } from 'react-router'

import { toast } from 'sonner'
import { AgrolinkingLogo } from '~/components/agrolinking-logo'
import type { Route } from './+types/forgot-password'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Forgot Password | Agtrail' },
    {
      name: 'description',
      content: 'Reset your Agtrail account password',
    },
  ]
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      toast.error('Please enter your email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Enter a valid email address.')
      return
    }
    toast.info(
      'Password reset is not wired to the API yet. Contact your administrator if you need access.',
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <AgrolinkingLogo className="mb-8 h-14" />

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="mt-2 max-w-xs text-center text-sm text-gray-500">
            No worries! Enter your email address and we&apos;ll send you a link to
            reset your password.
          </p>

          {/* Form */}
          <form className="mt-8 w-full space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="reset-email"
                className="block text-sm font-semibold text-gray-900"
              >
                Email Address
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="h-11 w-full rounded-md bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to login */}
          <Link
            to="/login"
            className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span>←</span>
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
