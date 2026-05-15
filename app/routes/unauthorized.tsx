import { Link, useNavigate } from 'react-router'
import { AgrolinkingLogo } from '~/components/agrolinking-logo'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/context/auth-context'

export default function UnauthorizedPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Determine the natural dashboard based on systemRole
  const role = user?.systemRole?.toLowerCase();
  let dashboardPath = '/farmer'; // default
  
  if (role === 'processor') dashboardPath = '/processor';
  else if (role === 'aggregator') dashboardPath = '/aggregator';
  else if (role === 'transporter') dashboardPath = '/transporter';
  else if (role === 'field-agent') dashboardPath = '/field-agent';
  else if (role === 'cooperative') dashboardPath = '/cooperative';
  else if (role === 'exporter') dashboardPath = '/exporter';
  else if (role === 'regulator') dashboardPath = '/regulator';
  else if (role === 'admin') dashboardPath = '/admin';

  const handleSwitchAccount = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <AgrolinkingLogo className="mb-8 h-12" />
        
        <div className="mb-6 rounded-full bg-red-100 p-4">
          <svg className="size-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Access Denied</h1>
        <p className="mt-4 text-sm text-gray-500 font-medium">
          You don't have the necessary permissions to access this dashboard.
          Please contact your administrator if you believe this is an error.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button asChild className="w-full h-11 bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider text-xs">
            <Link to={dashboardPath}>Return to Dashboard</Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSwitchAccount}
            className="w-full h-11 border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-xs"
          >
            Sign in with another account
          </Button>
        </div>
      </div>
    </div>
  )
}
