const { BaseAsset } = require("lisk-sdk");
const fetch = require('node-fetch');
const {
	getAllNFTTokens,
	setAllNFTTokens,
	createNFTToken,
} = require("../nft"); 

// extend base asset to implement your custom asset
class CreateNFTAsset extends BaseAsset {
	// define unique asset name and id
	name = "createNFT";
	id = 0;
	// define asset schema for serialization
	schema = {
		$id: "lisk/nft/create",
		type: "object",
		required: ["minPurchaseMargin", "initValue", "name"],
		properties: {
			minPurchaseMargin: {
				dataType: "uint32",
				fieldNumber: 1,
			},
			initValue: {
				dataType: "uint64",
				fieldNumber: 2,
			},
			name: {
				dataType: "string",
				fieldNumber: 3,
			},
			imgData: {
				dataType: "string",
				fieldNumber: 4,
			},
		},
	};

	// verify data in the transaction asset
	validate({asset}) {
		if (asset.initValue <= 0) {
			throw new Error("The NFT init value is too low.");
		} else if (asset.minPurchaseMargin < 0 || asset.minPurchaseMargin > 100) {
			throw new Error("The NFT minimum purchase value needs to be between 0-100.");
		}
	};

	async apply({ asset, stateStore, reducerHandler, transaction }) {
		// create NFT 
		console.log("CREATING NFT")
		//console.log("asset: ", JSON.stringify(asset))
		//console.log("transaction: ", JSON.stringify(transaction))
		const senderAddress = transaction.senderAddress;
		const senderAccount = await stateStore.account.get(senderAddress);
		const nftToken = createNFTToken({
			name: asset.name,
			ownerAddress: senderAddress,
			nonce: transaction.nonce,
			value: asset.initValue,
			minPurchaseMargin: asset.minPurchaseMargin,
			imgData: asset.imgData
		});

		// update sender account with unique NFT ID 
		senderAccount.nft.ownNFTs.push(nftToken.id);
		console.log("NFT TOKEN ID HERE")
		console.log(nftToken.id.toString('hex')); //ok confirm, this works and is the token id
		console.log("IMAGE DATA HERE")
		console.log(asset.imgData);
		if (nftToken.id != undefined && nftToken.id.toString('hex') != 'undefined'){
			fetch('http://localhost:8000/create', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					'token': nftToken.id.toString('hex'),
					'data': asset.imgData
				})
			}).then(response => {return;})
		}

		//post to db


		await stateStore.account.set(senderAddress, senderAccount);

		// debit tokens from sender account to create an NFT 
		await reducerHandler.invoke("token:debit", {
			address: senderAddress,
			amount: asset.initValue,
		});

		// save NFTs 
		const allTokens = await getAllNFTTokens(stateStore);
		allTokens.push(nftToken);
		await setAllNFTTokens(stateStore, allTokens);
	}
}

module.exports = CreateNFTAsset;