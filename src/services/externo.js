import api from '../util/request.js'

export const searchPersonal = async ({cedula}) => {
  try {
    const { data } = await api.get(`personal/search`, {
      params: {
        cedula
      }
    })
    return data.data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}

export const sendDocument = async ({ datos }) => {
  try {
    const { data } = await api.post('documento-externo/registrar', datos)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const viewDocument = async ({ id }) => {
  try {
    const { data } = await api.get(`documento-externo/${id}`)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const downloadDocument = async ({ id }) => {
  try {
    const { data } = await api.get(`documento-externo/generar-documento/${id}`, { responseType: 'blob'})
    return data
  } catch (error) {
    console.log({error})
    return Promise.reject(error)
  }
}
