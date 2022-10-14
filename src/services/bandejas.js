import api from '../util/request.js'

export const getBandeja = async ({ bandeja }) => {
  try {
    const { data } = await api.get(`bandeja/${bandeja}`)
    return data.data
  } catch (error) {
    return Promise.reject(error)
  }
}
