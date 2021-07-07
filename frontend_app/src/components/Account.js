import React, { useState, useEffect } from "react";
import { Container, Typography, Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {Buffer, cryptography, transactions} from "@liskhq/lisk-client";
import NFTToken from "./NFTToken";
import { fetchNFTToken } from "../api";

const useStyles = makeStyles((theme) => ({
	propertyList: {
		listStyle: "none",

		"& li": {
			margin: theme.spacing(2, 0),
			borderBottomColor: theme.palette.divider,
			borderBottomStyle: "solid",
			borderBottomWidth: 1,

			"& dt": {
				display: "block",
				width: "100%",
				fontWeight: "bold",
				margin: theme.spacing(1, 0),
			},
			"& dd": {
				display: "block",
				width: "100%",
				margin: theme.spacing(1, 0),
			},
		},
	},
}));

export default function Account(props) {
	const [nftTokens, setNftTokens] = useState([]);
	const [mapper, setMapper] = useState([]);
	const classes = useStyles();
	const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.account.address, 'hex'), 'lsk').toString('binary');

	useEffect(() => {
		async function fetchData() {
			setNftTokens(
				await Promise.all(props.account.nft.ownNFTs.map((a) => fetchNFTToken(a)))
			);
		}
		fetchData();
	}, [props.account.nft.ownNFTs]);

	useEffect(() => {
		async function fetchData2() {
			setMapper(await fetch('http://localhost:8000/all')
			.then(response => {
				if(response.status == 200) return response.json();
				else return [];
			}).then(obj => {
				var xx = {};
				for (let i = 0; i < obj['data'].length; i++) xx[obj['data'][i]['token']] = obj['data'][i]['data'];
				return xx;
			}));
		}
		fetchData2();
	}, []);

	return (
		<Container>
			<Typography variant="h5">{base32UIAddress}</Typography>
			{base32UIAddress=="lskwwmtg88fyv7sg52t2r45sm7p4r8guk5wwq8bb5"?
			<h1>The Judge</h1>
			:
			null}
			<Divider />
			<dl className={classes.propertyList}>
				<li>
				<dt>LSK Balance</dt>
				<dd>
					{transactions.convertBeddowsToLSK(props.account.token.balance)}
				</dd>
				<dt>Nonce</dt>
				<dd>{props.account.sequence.nonce}</dd>
				<dt>Binary address</dt>
				<dd>{props.account.address}</dd>
				</li>
			</dl>

			<Typography variant="h6">{"Collection"}</Typography>

			<Grid container spacing={4}>
				{nftTokens.map((item) => (
					<Grid item md={3}>
						{(item.id in mapper)?
						<NFTToken item={item} key={item.id} img={mapper[item.id]} minimum={true} />
						:
						<NFTToken item={item} key={item.id} minimum={true}/>
						}
					</Grid>
				))}
			</Grid>

		</Container>
	);
}
