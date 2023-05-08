import axios from "axios";

export default axios.create({
	baseURL: "http://localhost:3000/",
	headers: {
		"X-Requested-With": "XMLHttpRequest",
		"Content-Type": "application/json",
	},
	// withCredentials: true,
});
