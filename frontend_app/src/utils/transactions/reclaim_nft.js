/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema, calcMinTxFee } from "../common";
import { fetchAccountInfo } from "../../api";

export const reclaimNFTSchema = {
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

export const reclaimNFT = async ({
	nftId,
	passphrase,
	fee,
	networkIdentifier,
	minFeePerByte,
}) => {

    console.log("IN RECLAIM NFT")

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
		reclaimNFTSchema, {
			moduleID: 1024,
			assetID: 4,
			nonce: BigInt(nonce),
			fee: BigInt(transactions.convertLSKToBeddows(fee)),
			senderPublicKey: publicKey,
			asset: {
				nftId: Buffer.from(nftId, "hex"),
			},
		},
		Buffer.from(networkIdentifier, "hex"),
		passphrase
	);

	return {
		id: id.toString("hex"),
		tx: codec.codec.toJSON(getFullAssetSchema(reclaimNFTSchema), rest),
		minFee: calcMinTxFee(reclaimNFTSchema, minFeePerByte, rest),
	};
};
