export default function AggregatorSettingsPage() {
  return (
    <section className='space-y-5'>
      <header className='rounded-xl border border-gray-200 bg-white p-5'>
        <h1 className='text-2xl font-bold text-gray-900'>Aggregator Settings</h1>
        <p className='mt-1 text-sm text-gray-600'>Manage notification and workflow defaults for your aggregator operations.</p>
      </header>

      <div className='rounded-xl border border-gray-200 bg-white p-4'>
        <p className='text-base font-semibold text-gray-900'>Preferences</p>
        <ul className='mt-3 space-y-2 text-sm text-gray-700'>
          <li className='rounded-md border border-gray-100 px-3 py-2'>Auto-open scan result modal: Enabled</li>
          <li className='rounded-md border border-gray-100 px-3 py-2'>Default consolidation location: Johannesburg Hub A-1</li>
          <li className='rounded-md border border-gray-100 px-3 py-2'>Transfer variance threshold: 1.0%</li>
        </ul>
      </div>
    </section>
  )
}
