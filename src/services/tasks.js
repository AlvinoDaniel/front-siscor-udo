import api from '../util/request.js'

export const sendTasks = async ({ action, task, options }) => {
  const queryParams = options ? `${new URLSearchParams(options).toString()}` : ''

  try {
    const { data } = await api.get(`tareas/${action}/${task}?${queryParams}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const taskVisita = async (options) => {
  try {
    const { data } = await api.post('tareas/actualizar/clientesvisitados', options)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getLogsTasks = async ({dateIni, dateEnd}) => {
  try {
    const { data } = await api.get(`tareas/actualizar?fecha_inicio=${dateIni}&&fecha_final=${dateEnd}`)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const taskStartPayment = async ({ entorno }) => {
  try {
    const { data } = await api.post('tareas/iniciarpagos', { entorno })
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}
