import ClientPage from './ClientPage'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
          <p className="font-bold">Loading...</p>
        </div>
      </div>
    }>
      <ClientPage />
    </Suspense>
  )
}
