import api from '../util/request.js'

export const recoverPassword = async ({ datos }) => {
  try {
    const { data } = await api.post('auth/reset-password', datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const infoCobro = async () => {
  try {
    const { data } = await api.get('pagos/infocobros')
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
