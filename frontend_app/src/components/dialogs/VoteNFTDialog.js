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
import { voteNFT } from "../../utils/transactions/vote_nft";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiTextField-root": {margin: theme.spacing(1),},
	},
}));

export default function VoteNFTDialog(props) {
	const nodeInfo = useContext(NodeInfoContext);
	const classes = useStyles();

	const [data, setData] = useState({
		name: props.token.name,
		nftId: props.token.id,
		recipientAddress: "",
		fee: "1",
		voteValue: "0",
		passphrase: "",
	});

	const handleChange = (event) => {
		event.persist();
		setData({ ...data, [event.target.name]: event.target.value });
	};

	const handleSend = async (event) => {
		event.preventDefault();

		const res = await voteNFT({
			...data,
			networkIdentifier: nodeInfo.networkIdentifier,
			minFeePerByte: nodeInfo.minFeePerByte,
		});
		await api.sendTransactions(res.tx);
		props.handleClose();
	};

	return (
		<Fragment>
			<Dialog open={props.open} onBackdropClick={props.handleClose}>
				<DialogTitle id="alert-dialog-title">{"Vote Pix - " + props.token.name}</DialogTitle>
				<DialogContent>
					<form className={classes.root} noValidate autoComplete="off">

						<TextField
						label="Token ID"
						disabled={true}
						value={data.nftId}
						name="nftId"
						fullWidth
						/>

						<TextField
						label="Vote Amount"
						value={data.voteValue}
						name="voteValue"
						onChange={handleChange}
						fullWidth
						/>

						<TextField
						label="Passphrase"
						value={data.passphrase}
						name="passphrase"
						onChange={handleChange}
						fullWidth
						/>

						<br></br>
						<Alert severity="warning">Voting for a Pix costs 1 LSK</Alert>

					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSend}>Vote Pix</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
