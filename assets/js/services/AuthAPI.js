import axios from 'axios';
import jwtDecode from 'jwt-decode';

function authenticate(credentials){
	return axios
		.post("http://localhost:8000/api/login_check", credentials)
		.then(response => response.data.token)
		.then(token => {
			// Stockage du token dans le localStorage
			window.localStorage.setItem("authToken", token);
		
			// on préviens axios qu'on a un header Authorization sur toute nos future requetes HTTP
			setAxiosToken(token)

			return true;
		})
}

function logout(){
	// Retire le token dans le localStorage
	window.localStorage.removeItem("authToken");

	// on préviens axios qu'on veut supprimer le header Authorization sur toute nos future requetes HTTP
	delete axios.defaults.headers["Authorization"];
}

function setAxiosToken(token) {
	axios.defaults.headers["Authorization"] = "Bearer " + token;			
	
}

function setup(){
	const token = window.localStorage.getItem("authToken");
	if (token){
		const jwtData = jwtDecode(token)
		if (jwtData.exp * 1000 > new Date().getTime()) {
			setAxiosToken(token)
		}
	}
}

function isAuthenticated(){
	const token = window.localStorage.getItem("authToken");
	if (token){
		const jwtData = jwtDecode(token)
		if (jwtData.exp * 1000 > new Date().getTime()) {
			return true
		}
		return false
	}
	return false
}

export default {
	authenticate,
	logout,
	setup,
	isAuthenticated
}