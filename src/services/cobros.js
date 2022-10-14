import api from '../util/request.js'

export const createCobro = async ({ datos }) => {
  try {
    const { data } = await api.post('pagos/pago/crear', datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getFacturas = async ({ cliente }) => {
  try {
    const { data } = await api.get(`pagos/${cliente}/facturas`)
    return data.data
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
