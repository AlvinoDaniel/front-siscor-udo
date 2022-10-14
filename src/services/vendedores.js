import api from '../util/request.js'

export const getEstadisticaCXC = async ({ id }) => {
  try {
    const { data } = await api.get(`vendedores/${id}/estadisticas-cxc`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getVendedores = async () => {
  try {
    const { data } = await api.get('vendedores')
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}
