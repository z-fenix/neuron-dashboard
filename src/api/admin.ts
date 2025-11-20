import type { License } from '@/types/admin'
import type { LogType } from '@/types/enums'
import http from '@/utils/http'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export const queryLog = (data: {
  since: number
  until: number
  level?: LogType
  page: number
  page_size: number
}): Promise<AxiosResponse<{ error: number; rows: Array<string>; page_count: number }>> => {
  return http.get('/log', { params: data })
}

export const queryLicense = (): Promise<AxiosResponse<License & { error: number }>> => {
  /** return http.get('/license', {
    _handleErrorSelf: true,
  } as AxiosRequestConfig) */
  return Promise.resolve({
    data: {
      license_type: 'premium',
      valid: true,
      valid_since: '2024-01-01',
      valid_until: '2099-12-31',
      max_nodes: 100,
      max_node_tags: 500,
      enabled_plugins: [],
      used_nodes: 0,
      used_tags: 0,
      hardware_token: '',
      object: 'license',
      email_address: 'user@example.com',
      nodesUsage: 0,
      tagsUsage: 0,
      error: 0,
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig
  } as AxiosResponse<License & { error: number }>);
}

/**
 * To use `_compatibleErrorCode`, please update @/utils/constants.ts file  `SELF_HANDLE_ERROR_CODES`,
 *   and use `compatible{errorCode}` to update @i18n/error.ts file.
 *  */
export const uploadLicense = (license: string): Promise<AxiosResponse<{ error: 0 }>> => {
  return http.post(
    '/license',
    {
      license,
    },
    {
      _compatibleErrorCode: true,
      name: 'uploadLicense',
    } as AxiosRequestConfig,
  )
}

export const queryVersion = (): Promise<AxiosResponse<any>> => {
  return http.get('/version')
}
export const queryHardwareToken = (): Promise<AxiosResponse<any>> => {
  // return http.get('/hwtoken')
  return Promise.resolve({
    data: {
      token: '',
      device_id: 'device-abc123',
      generated_at: '2024-01-15T10:30:00Z',
      expires_at: '2024-12-31T23:59:59Z',
      status: 'active',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig
  } as AxiosResponse<any>)
}

export const downloadLogs = (): Promise<AxiosResponse<any>> => {
  return http({
    url: '/log/file',
    method: 'get',
    responseType: 'blob',
    timeout: 1800000,
  })
}
