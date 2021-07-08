const { BaseAsset } = require("lisk-sdk");
const { getAllNFTTokens, setAllNFTTokens } = require("../nft");

// 1.extend base asset to implement your custom asset
class ReclaimNFTAsset extends BaseAsset {
	// 2.define unique asset name and id
	name = "reclaimNFT";
	id = 4;
	// 3.define asset schema for serialization
	schema = {
		$id: "lisk/nft/reclaim",
		type: "object",
		required: ["nftId"],
		properties: {
			nftId: {
				dataType: "bytes",
				fieldNumber: 1,
			},
		},
	};

	async apply({ asset, stateStore, reducerHandler, transaction }) {

		const nftTokens = await getAllNFTTokens(stateStore);
		const nftTokenIndex = nftTokens.findIndex((t) => t.id.equals(asset.nftId));

		// 4. verify if the nft exists 
		if (nftTokenIndex < 0) {
			throw new Error("Token id not found");
		}

		const token = nftTokens[nftTokenIndex];
		const tokenOwnerAddress = token.ownerAddress;
		const senderAddress = transaction.senderAddress;
		
		// 5. verify that the owner is the judge
		if (tokenOwnerAddress.toString("hex") != "bdcb3fbdfe889dbfaf13c492bd95c44c9ff85177"){
			throw new Error("Pix does not belong to the Collector.")
		} else {
			console.log("The Collector owns the Pix");
		}

		console.log("TOKEN CREATOR")
		console.log(token.creatorAddress.toString('hex'))
		console.log(token.creatorAddress)
		console.log("SENDER ADDRESS")
		console.log(senderAddress)

		// 6. verify that the sender is the creator
		if (token.creatorAddress.toString('hex') != "" && !senderAddress.equals(token.creatorAddress)){
			console.log("Error - request is not made by the creator");
			throw new Error("Error - request is not made by the creator.");
		} else {
			console.log("Request is made by the creator.");
		}

		const tokenOwner = await stateStore.account.get(tokenOwnerAddress);
		// 7. remove nft from the owner account 
		const ownerTokenIndex = tokenOwner.nft.ownNFTs.findIndex((a) => a.equals(token.id));
		tokenOwner.nft.ownNFTs.splice(ownerTokenIndex, 1);
		await stateStore.account.set(tokenOwnerAddress, tokenOwner);

		// 8. add nft to the recipient account
		const recipientAddress = token.creatorAddress;
		const recipientAccount = await stateStore.account.get(recipientAddress);
		recipientAccount.nft.ownNFTs.push(token.id);
		await stateStore.account.set(recipientAddress, recipientAccount);

		// 9. set the relevant attributes of the token
		token.ownerAddress = recipientAddress;
		nftTokens[nftTokenIndex] = token;
		await setAllNFTTokens(stateStore, nftTokens);
	}
}

module.exports = ReclaimNFTAsset;