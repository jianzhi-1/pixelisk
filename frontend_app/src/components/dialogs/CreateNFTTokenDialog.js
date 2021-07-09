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
import { createNFTToken } from "../../utils/transactions/create_nft_token";
import * as api from "../../api";
import Editor from "../digiart/Editor";

const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiTextField-root": {
			margin: theme.spacing(1),
		},
	},
}));

export default function CreateNFTTokenDialog(props) {
	const nodeInfo = useContext(NodeInfoContext);
	const classes = useStyles();
	const [imgData, setImgData] = useState("")
	const [disableSend, setDisableSend] = useState(true)
	const [data, setData] = useState({
		name: "",
		initValue: "2",
		minPurchaseMargin: "20",
		fee: "5",
		passphrase: "",
	});

	const handleChange = (event) => {
		event.persist();
		setData({ ...data, [event.target.name]: event.target.value });
	};

	const handleImgChange = (value) => {
		//event.persist();
		console.log("VALUE IN HANDLE IMG CHANGE")
		console.log(value)
		setImgData(value);
	};

	const handleSend = async (event) => {
		event.preventDefault();

		const res = await createNFTToken({
			...data,
			imgData,
			networkIdentifier: nodeInfo.networkIdentifier,
			minFeePerByte: nodeInfo.minFeePerByte,
		});
		await api.sendTransactions(res.tx);
		props.handleClose();
	};

	return (
		<Fragment>
			<Dialog open={props.open} onBackdropClick={props.handleClose}>
				<DialogTitle id="alert-dialog-title">{"Create Pix"}</DialogTitle>
				<DialogContent>
					<form className={classes.root} noValidate autoComplete="off">
						<TextField
						label="Pix Name"
						value={data.name}
						name="name"
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

						<Editor
						changeParent={handleImgChange}
						changeDisableSend={setDisableSend}
						/>

						<br></br>
						<Alert severity="warning">Creating a Pix costs 5 LSK</Alert>

					</form>
				</DialogContent>

				<DialogActions>
					<Button disabled={disableSend} onClick={handleSend}>Create Pix</Button>
				</DialogActions>

			</Dialog>
		</Fragment>
	);
}
