import type { AxiosError } from 'axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router/'
import store from '@/store/index'
import { LOGIN_ROUTE_NAME, CHANGE_PW_ROUTE_NAME } from '@/router/routes'
import type { CompatibleErrorCode } from './utils'
import { countBaseURL, popUpErrorMessage, dataType, isJSONData } from './utils'
import { API_TIMEOUT } from '@/config/index'

const baseURL = countBaseURL()
const option = {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
  },
  baseURL,
  timeout: API_TIMEOUT,
}

Object.assign(axios.defaults, option)

export const handleBlobError = async (
  data: Blob,
  statusInfo: { status: number; statusText: string },
  compatibleErrorCodes?: CompatibleErrorCode,
) => {
  const { statusText, status } = statusInfo
  const statusMsg = statusText

  const reader = new FileReader()
  reader.readAsText(data, 'utf-8')
  reader.onload = () => {
    const msg = reader.result || ''

    if (typeof msg === 'string') {
      isJSONData(msg)
        .then(() => {
          const jsonText = JSON.parse(reader.result as string)
          const { error: errorNumber } = jsonText
          if (errorNumber) {
            popUpErrorMessage(errorNumber, compatibleErrorCodes)
          } else {
            ElMessage.error(statusMsg)
          }
        })
        .catch(() => {
          ElMessage.error(statusMsg)
        })
    } else {
      ElMessage.error(statusMsg)
    }
  }
}

export const handleError = (error: AxiosError) => {
  const { response, message, config } = error
  const customConfig = config as any
  const { _compatibleErrorCode, name } = customConfig || {}
  const errorParams = { compatibleErrorCode: !!_compatibleErrorCode, name }

  if (!response) {
    ElMessage.error(message || 'Unknown error')
    return
  }

  const { data } = response

  // 处理 Blob 数据
  if (data instanceof Blob || dataType(data) === 'blob') {
    handleBlobError(data as Blob, {
      statusText: response.statusText,
      status: response.status
    }, errorParams)
    return
  }

  // 使用类型断言处理普通数据
  const errorData = data as any

  if (errorData?.error) {
    popUpErrorMessage(errorData.error, errorParams)
  } else {
    const statusText = errorData?.statusText || response.statusText || message
    const status = errorData?.status || response.status
    const msg = statusText || message || String(status) || 'Unknown error'
    ElMessage.error(msg)
  }
}
const { CancelToken } = axios

axios.interceptors.request.use(
  (config) => {
    if (store.state.token) {
      // 使用 AxiosHeaders 的方法来设置 header
      if (!config.headers) {
        config.headers = new axios.AxiosHeaders()
      }
      config.headers.set('Authorization', `Bearer ${store.state.token}`)
    }

    config.cancelToken = new axios.CancelToken((cancel: any) => {
      store.commit('ADD_AXIOS_PROMISE_CANCEL', cancel)
    })

    return config
  },
  (error) => Promise.reject(error),
)
axios.interceptors.response.use(
  (response) => {
    const { status, data, config } = response
    const { _compatibleErrorCode, name } = (config as any) || {}
    const errorParams = { compatibleErrorCode: !!_compatibleErrorCode, name }

    if (status !== 200) {
      popUpErrorMessage(data.error, errorParams)
    } else if (data?.error) {
      if (!(response.config as any)._handleCustomError) {
        popUpErrorMessage(data.error, errorParams)
      }
      return Promise.reject(response)
    }

    return response
  },
  (error) => {
    // when requesting login, the interface will return 401 if the password or username is error, handle it
    const whiteRoutes = [LOGIN_ROUTE_NAME, CHANGE_PW_ROUTE_NAME]

    const currrentRouteName: any = router.currentRoute?.value?.name || ''
    const isInLoginPage = whiteRoutes.includes(currrentRouteName)

    if ((error?.response?.status === 401 && !isInLoginPage) || error?.response?.status === 403) {
      store.commit('LOGOUT')
      router.push({ name: 'Login' })
    } else if (axios.isCancel(error)) {
      // Finalizing the promise chain，will not trigger error messages
      return Promise.resolve()
    } else if (!error?.config?._handleErrorSelf) {
      handleError(error)
    }

    return Promise.reject(error)
  },
)

export default axios
