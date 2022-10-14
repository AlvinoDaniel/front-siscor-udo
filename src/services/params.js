import api from '../util/request.js'

export const getParams = async () => {
  try {
    const { data } = await api.get('administracion/parametros')
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const createParam = async ({ datos }) => {
  try {
    const { data } = await api.post('administracion/parametros', datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const updateParam = async ({ datos, id }) => {
  try {
    const { data } = await api.put(`administracion/parametros/${id}`, datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteParam = async ({ id }) => {
  try {
    const { data } = await api.delete(`administracion/parametros/${id}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
