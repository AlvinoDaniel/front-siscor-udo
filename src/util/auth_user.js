// import Cookies from 'js-cookie'


export function SET_USER(user){
	localStorage.setItem('user@info', JSON.stringify(user));
}

export function SET_TOKEN(token){
	localStorage.setItem('user@Token', token);
}


export function GET_USER(){
	const user = localStorage.getItem('user@info');

	return user ? JSON.parse(user) : null;
}

export function GET_TOKEN(){
	const token = localStorage.getItem('user@Token');

	return token ? token : null;
}

export function REMOVE_USER(){
	localStorage.removeItem('user@info');
	localStorage.removeItem('user@Token');
}


