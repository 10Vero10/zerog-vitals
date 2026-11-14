import { useQuery } from '@tanstack/react-query'
import { loadAppConfig } from '@/services/configService'

export function useAppConfig() {
  return useQuery({ queryKey: ['config'], queryFn: loadAppConfig, staleTime: Infinity, retry: 1 })
}
