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

export const updateDocument = async ({ datos, id }) => {
  try {
    const { data } = await api.post(`documento/actualizar/${id}`, datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const viewDocument = async ({ id, estatus }) => {
  try {
    const { data } = await api.get(`documento/${id}?estatus=${estatus}`)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const deleteAttach = async ({ id }) => {
  try {
    const { data } = await api.post(`documento/eliminar-anexo/${id}`)
    return Promise.resolve(data)
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const addAttach = async ({ datos }) => {
  try {
    const { data } = await api.post('documento/agregar-anexo', datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
