import { useState } from 'react'
import { DojahWidget } from '~/components/dojah-widget'

export default function DojahTestPage() {
  const [shouldLaunchKyc, setShouldLaunchKyc] = useState(false)
  const [kycLaunchCount, setKycLaunchCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  // Hardcoded sandbox credentials for testing
  // Ensure these match your actual sandbox credentials!
  const appID = '6914e3d2a439cae29bda8d17'
  const publicKey = '0TbiVnGE8U3gLIUl'

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  const response = (type: string, data: any) => {
    console.log('Test Dojah event:', type, data)
    addLog(`Event received: ${type}`)

    if (type === 'success') {
      addLog(`Success! Data: ${JSON.stringify(data)}`)
      setShouldLaunchKyc(false)
    } else if (type === 'error') {
      addLog(`Error! Data: ${JSON.stringify(data)}`)
      setShouldLaunchKyc(false)
    } else if (type === 'close') {
      addLog('Widget closed by user')
      setShouldLaunchKyc(false)
    }
  }

  // Pure dummy configurations
  const config = {
    debug: true,
    reference_id: `test-kyc-${Math.random().toString(36).substring(7)}`,
    widget_id: '69fe13cc22ab44a069efc0e7',
  }

  const userData = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'test@example.com',
  }

  const metadata = {
    user_id: 'dummy_user_123',
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-2xl rounded-md bg-white p-6 shadow-sm border border-gray-200'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Dojah KYC Sandbox Test</h1>
        <p className='text-sm text-gray-500 mb-6'>
          This is a completely isolated test environment with fresh reference IDs on every run.
          If DeviceGuard continues to fail here, there is an issue with the App ID/Public Key pairing or Sandbox configuration on Dojah's end.
        </p>

        <div className='flex items-center gap-4 mb-8'>
          <button
            onClick={() => {
              setKycLaunchCount((c) => c + 1)
              setShouldLaunchKyc(true)
              addLog('Launching widget...')
            }}
            className='rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            Start Test Verification
          </button>

          <button
            onClick={() => setLogs([])}
            className='rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200'
          >
            Clear Logs
          </button>
        </div>

        {shouldLaunchKyc && (
          <DojahWidget
            key={kycLaunchCount}
            appID={appID}
            publicKey={publicKey}
            type='identification'
            config={config}
            userData={userData}
            metadata={metadata}
            response={response}
          />
        )}

        <div className='mt-8 rounded-md bg-gray-900 p-4 font-mono text-xs text-green-400 min-h-[200px] overflow-auto'>
          <p className='text-gray-500 mb-2'>// Event Logs</p>
          {logs.length === 0 ? (
            <p className='text-gray-600'>No events yet...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className='mb-1'>{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
