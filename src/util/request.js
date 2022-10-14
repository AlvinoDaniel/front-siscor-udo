import axios from 'axios'
import store from '../store'
import router from '../router'

const service = axios.create({
   	baseURL: process.env.VUE_APP_BASE_API,
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',}
});

service.interceptors.response.use(function (response) {
   return response
}, function (error) {

 	if (error.response && error.response.status === 401) {
		store.dispatch('user/closeSession').then(()=>{
			router.push({ path: '/auth/login/' });
		});
	}

 	if (error.response && error.response.status === 403) {
		// store.dispatch('app/setOverlay', true);
		router.push({ path: '/403' });
		router.go()
	}
	
    return Promise.reject(error)
})

export default service;