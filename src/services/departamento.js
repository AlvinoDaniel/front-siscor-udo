import api from '../util/request.js'

export const getDepartamentoList = async () => {
  try {
    const { data } = await api.get('departamentos')
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}
export const getDepartamentos = async () => {
  try {
    const { data } = await api.get('departamentos/list/redactar')
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}
