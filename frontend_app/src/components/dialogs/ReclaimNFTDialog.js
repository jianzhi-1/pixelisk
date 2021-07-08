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
import { reclaimNFT } from "../../utils/transactions/reclaim_nft";
import * as api from "../../api";
import  { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		"& .MuiTextField-root": {margin: theme.spacing(1),},
	},
}));

export default function ReclaimNFTDialog(props) {
	const nodeInfo = useContext(NodeInfoContext);
	const classes = useStyles();
    const [error, setError] = useState("");

	const [data, setData] = useState({
		name: props.token.name,
		nftId: props.token.id,
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
			const res = await reclaimNFT({
                ...data,
                networkIdentifier: nodeInfo.networkIdentifier,
                minFeePerByte: nodeInfo.minFeePerByte,
            });
			const res2 = await api.sendTransactions(res.tx);
			console.log("RES2 here");
			console.log(res2)
			props.handleClose();
			console.log(res)
			console.log("IM DONE HERE")

		} catch (err){
			console.log("I CAUGHT AN ERROR")
			console.log(err)
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
				<DialogTitle id="alert-dialog-title">{"Reclaim Pix - " + data.name}</DialogTitle>
				<DialogContent>
					<form className={classes.root} noValidate autoComplete="off">

						<TextField
						label="Token ID"
                        disabled={true}
						value={data.nftId}
						name="nftId"
                        disabled={true}
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
						<Alert severity="warning">Reclaiming a Pix costs 1 LSK</Alert>


					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSend}>Reclaim Pix</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
