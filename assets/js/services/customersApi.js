import axios from 'axios';

function findAll(){
	return axios
	.get("http://localhost:8000/api/customers")
	.then((response)=> response.data["hydra:member"])
}

function deleteCustomer(id){
	return axios
		.delete("http://localhost:8000/api/customers/" + id)
		.then((response)=> console.log("ok"))
}

function find(id) {
	return axios.get("http://localhost:8000/api/customers/" + id)
	.then((response) => response.data)
}

function create(customer){
	return axios.post("http://localhost:8000/api/customers", customer)
}

function update(customer, id){
	return axios.put("http://localhost:8000/api/customers/" + id, customer)
}

export default {
	findAll,
	find,
	update,
	create,
	delete: deleteCustomer
}