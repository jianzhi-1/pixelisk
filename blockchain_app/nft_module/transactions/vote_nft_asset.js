const { BaseAsset } = require("lisk-sdk");
const { getAllNFTTokens, setAllNFTTokens } = require("../nft");

// 1.extend base asset to implement your custom asset
class VoteNFTAsset extends BaseAsset {
	// 2.define unique asset name and id
	name = "voteNFT";
	id = 3;
	// 3.define asset schema for serialization
	schema = {
		$id: "lisk/nft/vote",
		type: "object",
		required: ["nftId", "voteValue"],
		properties: {
			nftId: {
				dataType: "bytes",
				fieldNumber: 1,
			},
			voteValue: {
				dataType: "uint64",
				fieldNumber: 2,
			}
		},
  	};

 	async apply({ asset, stateStore, reducerHandler, transaction }) {

		console.log("REACHED HEREREERRE")
		 // verify if voting nft exists 
		const nftTokens = await getAllNFTTokens(stateStore);
		const nftTokenIndex = nftTokens.findIndex((t) => t.id.equals(asset.nftId));

		//some checks
		//is it owned by the judge?
		//does the user have enough lisk tokens to vote? (inclusive of voting fee)

		// 4.verify if the nft exists 
		if (nftTokenIndex < 0) {
			throw new Error("Token id not found");
		}

		// 5. verify if vote is legitimate
		if (asset.voteValue <= 0){
			throw new Error("Vote value cannot be non-positive!")
		}

		const token = nftTokens[nftTokenIndex];
		const tokenOwnerAddress = token.ownerAddress.toString('hex'); //which should be the judge's address

		//check this logic out a bit
		// 5.verify that the sender owns the nft 
		console.log("TOKEN OWNER ADDRESS")
		console.log(tokenOwnerAddress);
		console.log(token.ownerAddress.toString())
		console.log(token.ownerAddress)
		//bdcb3fbdfe889dbfaf13c492bd95c44c9ff85177
		if (tokenOwnerAddress != "bdcb3fbdfe889dbfaf13c492bd95c44c9ff85177"){
			console.log("NOT JUDGE!!!")
			//throw new Error("Vote cannot be sent to a person other than The Judge.")
		} else {
			console.log("ACCEPTED - TOKEN BELONGS TO JUDGE");
		}

		//update the token value
		console.log("TOKEN VALUE")
		console.log(token.value)
		console.log("UPDATED VALUE")
		console.log(asset.voteValue)
		token.value = token.value + asset.voteValue;
		nftTokens[nftTokenIndex] = token;
		await setAllNFTTokens(stateStore, nftTokens);

		// debit LSK tokens from voter's account 

		const voterAddress = transaction.senderAddress;

		await reducerHandler.invoke("token:debit", {
			address: voterAddress,
			amount: asset.voteValue,
		});

  	}
}

module.exports = VoteNFTAsset;