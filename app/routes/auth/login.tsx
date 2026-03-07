import { Link } from 'react-router'

import { AgrolinkingLogo } from '~/components/agrolinking-logo'
import type { Route } from './+types/login'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Login | Agtrail' },
    { name: 'description', content: 'Sign in to your Agtrail account' },
  ]
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <AgrolinkingLogo className="mb-8 h-12" />

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Agtrail</h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            Need an account? Contact your administrator for an invite.
          </p>

          {/* Form */}
          <form className="mt-8 w-full space-y-5">
            {/* Email / Phone */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-gray-900"
              >
                Email or Phone Number
              </label>
              <input
                id="login-email"
                type="text"
                placeholder="m@example.com or +234 801 234 5678"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Forgot Password
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By clicking continue, you agree to{' '}
            <br />
            our{' '}
            <a href="#" className="underline hover:text-gray-900">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-gray-900">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
