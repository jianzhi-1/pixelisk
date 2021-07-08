/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const voteNFTSchema = {
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
		},
	},
};

export const voteNFT = async ({
	nftId,
	voteValue,
	passphrase,
	fee,
	networkIdentifier,
	minFeePerByte,
}) => {

	const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
		passphrase
	);
	const address = cryptography.getAddressFromPassphrase(passphrase);
	//const recipient = cryptography.getAddressFromBase32Address(recipientAddress);
	const {
		sequence: { nonce },
	} = await fetchAccountInfo(address.toString("hex"));

	console.log("SENDER ID")
	console.log("SENDER ADDRESS")
	console.log(address)

	const { id, ...rest } = transactions.signTransaction(
		voteNFTSchema, {
			moduleID: 1024,
			assetID: 3,
			nonce: BigInt(nonce),
			fee: BigInt(transactions.convertLSKToBeddows(fee)),
			senderPublicKey: publicKey,
			asset: {
				nftId: Buffer.from(nftId, "hex"),
				voteValue: BigInt(transactions.convertLSKToBeddows(voteValue)),
			},
		},
		Buffer.from(networkIdentifier, "hex"),
		passphrase
	);

	console.log(id.toString("hex"))

	console.log("AFTER WARDS")

	return {
		id: id.toString("hex"),
		tx: codec.codec.toJSON(getFullAssetSchema(voteNFTSchema), rest),
		minFee: calcMinTxFee(voteNFTSchema, minFeePerByte, rest),
	};
};
