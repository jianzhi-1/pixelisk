const { BaseModule } = require("lisk-sdk");
const { getAllNFTTokensAsJSON } = require("./nft");

const CreateNFTAsset = require("./transactions/create_nft_asset");
const PurchaseNFTAsset = require("./transactions/purchase_nft_asset");
const TransferNFTAsset = require("./transactions/transfer_nft_asset");

// Extend from the base module to implement the NFT module
class NFTModule extends BaseModule {
  name = "nft"; //module name
  id = 1024; //module ID (unique within network, min value 1024)
  accountSchema = {
    type: "object",
    required: ["ownNFTs"],
    properties: {
        //array of NFTs that this account owns
      ownNFTs: {
        type: "array",
        fieldNumber: 1,
        items: {
          dataType: "bytes",
        },
      },
    },
    default: {
      ownNFTs: [],
    },
  };
  transactionAssets = [new CreateNFTAsset(), new PurchaseNFTAsset(), new TransferNFTAsset()];
  actions = {
    // get all the registered NFT tokens from blockchain
    getAllNFTTokens: async () => getAllNFTTokensAsJSON(this._dataAccess),
  };
}

module.exports = { NFTModule };