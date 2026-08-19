import ClientPage from '../ClientPage'

export async function generateStaticParams() {
  const params = []
  for (let i = 1; i <= 50; i++) {
    params.push({ id: String(i) })
  }
  return params
}

export const dynamicParams = false

export default function TicketDetailPage() {
  return <ClientPage />
}
