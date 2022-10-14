import api from '../util/request.js'

export const sendMessage = async ({ datos }) => {
  try {
    const { data } = await api.post('mensajes/enviar', datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getClients = async () => {
  try {
    const { data } = await api.get('mensajes/clientes')
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

