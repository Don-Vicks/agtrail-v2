import type { Route } from './+types/receivables'
import { ReceivablesPage } from '~/components/receivables-page'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Record Receivables | Agtrail Finance' },
    { name: 'description', content: 'Log farm product receivables' },
  ]
}

export default function RecordReceivablesPage() {
  return <ReceivablesPage dashboardHref="/farmer" />
}
