import api from '../util/request.js'

export const sendDocument = async ({ datos, status }) => {
  const urlDocument = {
    enviar: 'documento/enviar',
    corregir: 'documento/crear-temporal',
    borrador: 'documento/crear-temporal',
  }
  try {
    const { data } = await api.post(urlDocument[status], datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
