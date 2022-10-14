import api from '../util/request.js'

export const sendDocument = async ({ datos }) => {
  try {
    const { data } = await api.post('documento/enviar', datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
