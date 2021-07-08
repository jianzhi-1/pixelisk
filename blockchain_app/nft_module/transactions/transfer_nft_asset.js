const { BaseAsset } = require("lisk-sdk");
const { getAllNFTTokens, setAllNFTTokens } = require("../nft");

// 1.extend base asset to implement your custom asset
class TransferNFTAsset extends BaseAsset {
  // 2.define unique asset name and id
  name = "transferNFT";
  id = 2;
  // 3.define asset schema for serialization
  schema = {
    $id: "lisk/nft/transfer",
    type: "object",
    required: ["nftId", "recipient"],
    properties: {
      nftId: {
        dataType: "bytes",
        fieldNumber: 1,
      },
      recipient: {
        dataType: "bytes",
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

  async apply({ asset, stateStore, reducerHandler, transaction }) {
    const nftTokens = await getAllNFTTokens(stateStore);
    const nftTokenIndex = nftTokens.findIndex((t) => t.id.equals(asset.nftId));

    // 4.verify if the nft exists 
    if (nftTokenIndex < 0) {
      throw new Error("Token id not found");
    }
    const token = nftTokens[nftTokenIndex];
    const tokenOwnerAddress = token.ownerAddress;
    const senderAddress = transaction.senderAddress;
    // 5.verify that the sender owns the nft 

    if (!tokenOwnerAddress.equals(senderAddress)) {
      throw new Error("A Pix can only be transferred by the owner of the Pix.");
    }

    const recipientAddress = asset.recipient;

    console.log("RECIPIENT ADDRESS")
    console.log(recipientAddress);

    //if sending to the judge, can only be sent by the creator
    if (recipientAddress.toString("hex")=="bdcb3fbdfe889dbfaf13c492bd95c44c9ff85177"){
      if (!tokenOwnerAddress.equals(token.creatorAddress)){
        throw new Error("A Pix can only be transferred to The Collector by the creator.")
      } else {
        console.log("Accepted - sender to the judge is the original creator of the Pix");
      }
    } else {
      console.log("Accepted - recipient is not the judge");
    }

    const tokenOwner = await stateStore.account.get(tokenOwnerAddress);
    // 6.remove nft from the owner account 
    const ownerTokenIndex = tokenOwner.nft.ownNFTs.findIndex((a) =>
      a.equals(token.id)
    );
    tokenOwner.nft.ownNFTs.splice(ownerTokenIndex, 1);
    await stateStore.account.set(tokenOwnerAddress, tokenOwner);

    // 7.add nft to the recipient account 
    
    const recipientAccount = await stateStore.account.get(recipientAddress);
    recipientAccount.nft.ownNFTs.push(token.id);
    await stateStore.account.set(recipientAddress, recipientAccount);

    token.ownerAddress = recipientAddress;
    nftTokens[nftTokenIndex] = token;
    await setAllNFTTokens(stateStore, nftTokens);
  }
}

module.exports = TransferNFTAsset;