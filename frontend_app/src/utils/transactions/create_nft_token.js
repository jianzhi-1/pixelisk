/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const createNFTTokenSchema = {
	$id: "lisk/create-nft-asset",
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

export const createNFTToken = async ({
	name,
	initValue,
	minPurchaseMargin,
	passphrase,
	fee,
	imgData,
	networkIdentifier,
	minFeePerByte,
}) => {
	const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
		passphrase
	);
	const address = cryptography.getAddressFromPassphrase(passphrase).toString("hex");

	const {
		sequence: { nonce },
		nft: {ownNFTs},
	} = await fetchAccountInfo(address);

	console.log("ADDRESS ", ownNFTs)

	const { id, ...rest } = transactions.signTransaction(
		createNFTTokenSchema,
		{
			moduleID: 1024,
			assetID: 0,
			nonce: BigInt(nonce),
			fee: BigInt(transactions.convertLSKToBeddows(fee)),
			senderPublicKey: publicKey,
			asset: {
				name,
				initValue: BigInt(transactions.convertLSKToBeddows(initValue)),
				minPurchaseMargin: parseInt(minPurchaseMargin),
				imgData: imgData
			},
		},
		Buffer.from(networkIdentifier, "hex"),
		passphrase
	);
	console.log("id here")
	console.log(id.toString("hex"))
	console.log("Tx here")
	console.log(codec.codec.toJSON(getFullAssetSchema(createNFTTokenSchema), rest))

	return {
		id: id.toString("hex"),
		tx: codec.codec.toJSON(getFullAssetSchema(createNFTTokenSchema), rest),
		minFee: calcMinTxFee(createNFTTokenSchema, minFeePerByte, rest),
	};
};
