import React, { Fragment, useContext, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	DialogActions,
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";
import { transferNFT } from "../../utils/transactions/transfer_nft";
import * as api from "../../api";
import  { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiTextField-root": {margin: theme.spacing(1),},
	},
}));

export default function TransferNFTDialog(props) {
	const nodeInfo = useContext(NodeInfoContext);
	const classes = useStyles();

	const [error, setError] = useState("");

	const [data, setData] = useState({
		name: props.token.name,
		nftId: props.token.id,
		recipientAddress: "",
		fee: "1",
		passphrase: "",
	});

	const handleChange = (event) => {
		event.persist();
		setData({ ...data, [event.target.name]: event.target.value });
	};

	const handleSend = async (event) => {
		event.preventDefault();
		try {
			const res = await transferNFT({
				...data,
				networkIdentifier: nodeInfo.networkIdentifier,
				minFeePerByte: nodeInfo.minFeePerByte,
			});
			await api.sendTransactions(res.tx);
			props.handleClose();

		} catch (err){
			setError(err);
		}

	};

	console.log("ERROR")
	console.log(error)
	if (error != "") return (
		<Redirect
		to={{
			pathname: "/error",
			state: { name: error.name, msg: error.message }
		}}
		/>
	)

	return (
		<Fragment>
			<Dialog open={props.open} onBackdropClick={props.handleClose}>
				<DialogTitle id="alert-dialog-title">
					{"Transfer Pix"}
				</DialogTitle>

				<DialogContent>
					<form className={classes.root} noValidate autoComplete="off">
						<TextField
						label="Pix Name"
						disabled={true}
						value={data.name}
						name="name"
						fullWidth
						/>
						
						<TextField
						label="Pix ID"
						disabled={true}
						value={data.nftId}
						name="nftId"
						fullWidth
						/>

						<TextField
						label="Recipient address"
						value={data.recipientAddress}
						name="recipientAddress"
						onChange={handleChange}
						helperText={`Address of the account that will receive the Pix.`}
						fullWidth
						/>
						<Button
						onClick={(event) => {
							event.persist();
							setData({
								...data,
								recipientAddress: "lskwwmtg88fyv7sg52t2r45sm7p4r8guk5wwq8bb5",
							});
						}}
						>
						Transfer to The Collector
						</Button>

						<TextField
						label="Passphrase"
						value={data.passphrase}
						name="passphrase"
						onChange={handleChange}
						fullWidth
						/>
						<br></br>
						<Alert severity="warning">Transferring of Pix costs 1 LSK</Alert>
					</form>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleSend}>Transfer Pix</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
