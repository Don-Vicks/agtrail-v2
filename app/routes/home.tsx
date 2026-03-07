import { redirect } from 'react-router'

export function loader() {
  return redirect('/register/farmer')
}

export default function Home() {
  return null
}
