import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface FeatureFlags {
  enableKiaanAI: boolean
  enableOnlinePayment: boolean
  enableVisitorPass: boolean
  enableParcelTracking: boolean
  enableNoticeBoard: boolean
  enableBillingModule: boolean
  maintenanceMode: boolean
  newRegistrations: boolean
  isLoading: boolean
}

export function useFeatureFlags(): FeatureFlags {
  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ['system-settings-flags'],
    queryFn: async () => {
      try {
        const response = await api.get('/settings/public')
        return response?.data ?? {}
      } catch (err) {
        return {}
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  })

  return {
    enableKiaanAI: settings.enableKiaanAI !== 'false',
    enableOnlinePayment: settings.enableOnlinePayment !== 'false',
    enableVisitorPass: settings.enableVisitorPass !== 'false',
    enableParcelTracking: settings.enableParcelTracking !== 'false',
    enableNoticeBoard: settings.enableNoticeBoard !== 'false',
    enableBillingModule: settings.enableBillingModule !== 'false',
    maintenanceMode: settings.maintenanceMode === 'true',
    newRegistrations: settings.newRegistrations !== 'false',
    isLoading,
  }
}
