import { ApisauceInstance, create } from 'apisauce'

const apiBase: ApisauceInstance = create({
    baseURL: process.env.REACT_APP_API_ROOT,
})

const jsonAPI = (api: ApisauceInstance) => {
    api.setHeader('Content-Type', 'application/json')
    return api
}

export { apiBase, jsonAPI }
