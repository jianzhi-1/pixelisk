export const fetchNodeInfo = async () => {
	return fetch("http://localhost:4000/api/node/info")
	.then((res) => res.json())
	.then((res) => res.data);
};

export const fetchAccountInfo = async (address) => {
	return fetch(`http://localhost:4000/api/accounts/${address}`)
	.then((res) => res.json())
	.then((res) => res.data);
};

export const sendTransactions = async (tx) => {
	console.log(JSON.stringify(tx))
	return fetch("http://localhost:4000/api/transactions", {
		method: "POST",
		headers: {"Content-Type": "application/json",},
		body: JSON.stringify(tx),
	})	.catch((err) => {
	console.log("REACHED ERROR HERE")
	console.log(err)
	throw err})
	.then((res) => {
		return res.json()
	})
	.then((res) => {
		if ("errors" in res){
			if (res["errors"] != null && res["errors"].length > 0){
				throw new Error(res["errors"][0].message)
			}
		}
		return res.data;
	})
	.catch((err) => {
		console.log("REACHED ERROR")
		console.log(err)
		throw err
	});
};

export const fetchAllNFTTokens = async () => {
	return fetch("http://localhost:8080/api/nft_tokens")
	.then((res) => res.json())
	.then((res) => res.data);
};

export const fetchNFTToken = async (id) => {
	return fetch(`http://localhost:8080/api/nft_tokens/${id}`)
	.then((res) => res.json())
	.then((res) => res.data);
};

export const getAllTransactions = async () => {
	return fetch(`http://localhost:8080/api/transactions`)
	.then((res) => res.json())
	.then((res) => {return res.data;});
};
