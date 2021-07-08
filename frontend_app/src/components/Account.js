import React, { useState, useEffect } from "react";
import { Container, Typography, Divider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {Buffer, cryptography, transactions} from "@liskhq/lisk-client";
import NFTToken from "./NFTToken";
import { fetchNFTToken } from "../api";
const collector = require('../public/collector200.png');

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

	console.log("NFT TOKENS HERE")
	console.log(nftTokens);

	const judge = (base32UIAddress=="lskwwmtg88fyv7sg52t2r45sm7p4r8guk5wwq8bb5");

	var top3 = [];
	var networth = 0;
	var netpixworth = 0;
	//if (judge){
	for (let i = 0; i < nftTokens.length; i++){
		if (nftTokens[i].creatorAddress == "" || !(nftTokens[i].id in mapper)) continue;
		networth += parseInt(transactions.convertBeddowsToLSK(nftTokens[i].value));
		if (top3.length == 0){
			//just push in
			top3.push(nftTokens[i]);
		} else {
			top3.push(nftTokens[i]);
			for (let j = top3.length - 2; j >= 0; j--){
				let xx = transactions.convertBeddowsToLSK(top3[j].value);
				let yy = transactions.convertBeddowsToLSK(nftTokens[i].value);
				if (yy > xx){
					top3[j + 1] = top3[j];
					top3[j] = nftTokens[i];
				} else {
					break;
				}
			}
			while (top3.length > 3){
				top3.pop();
			}
		}
	}
	netpixworth = networth;
	networth += parseInt(transactions.convertBeddowsToLSK(props.account.token.balance));
	console.log("TOP 3");
	console.log(top3);
	//get the top 3
	//{/*<b>Pix Value:</b> {transactions.convertBeddowsToLSK(props.item.value)} LSK*/}
	//}

	return (
		<Container>
			<Typography variant="h5">{base32UIAddress}</Typography>
			{judge?
			<div>
				<h1>The Collector</h1>
				<img src={collector} width={200}/>
				<br></br>
			</div>
			:
			null}
			<Divider />
			<dl className={classes.propertyList}>
				<li>
				<dt>LSK Balance</dt>
				<dd>
					{transactions.convertBeddowsToLSK(props.account.token.balance)}
				</dd>

				{/*
				<dt>Nonce</dt>
				<dd>{props.account.sequence.nonce}</dd>
				<dt>Binary address</dt>
				<dd>{props.account.address}</dd>
				*/}

				<dt>Net Pix Worth</dt>
				<dd>{netpixworth}</dd>
				<dt>Net Worth</dt>
				<dd>{networth}</dd>
				</li>
			</dl>

			<Typography variant="h5">{"Most Prized Pix"}</Typography>
			<br></br>
			<br></br>

			<Grid container spacing={4}>

				{(top3.length > 1)?

				<Grid style={{backgroundColor:"silver"}} item md={4}>
					
					<NFTToken item={top3[1]} key={top3[1].id} img={mapper[top3[1].id]} mini={true} judge={judge} />
					
				</Grid>
				:
				<Grid style={{backgroundColor:"white"}} item md={4}>
				</Grid>
				}
				{(top3.length > 0)?
				<Grid style={{backgroundColor:"gold"}} item md={4}>
					
					<NFTToken item={top3[0]} key={top3[0].id} img={mapper[top3[0].id]} mini={true} judge={judge} />
				</Grid>
				:
				<Grid style={{backgroundColor:"white"}} item md={4}>
				</Grid>
				}

				{(top3.length > 2)?
					<Grid style={{backgroundColor:"#CD7F32"}} item md={4}>
						<NFTToken item={top3[2]} key={top3[2].id} img={mapper[top3[2].id]} mini={true} judge={judge} />
					</Grid>
				:
					<Grid style={{backgroundColor:"white"}} item md={4}>
					</Grid>
				}

			</Grid>

			<br></br>
			<br></br>

			<Typography variant="h6">{"Pix Gallery"}</Typography>

			<br></br>
			<br></br>

			<Grid container spacing={4}>
				{nftTokens.map((item) => {
					if (item.creatorAddress == "" || !(item.id in mapper)) return null;
					
					return (
					<Grid item md={4}>
						{(item.id in mapper)?
						<NFTToken item={item} key={item.id} img={mapper[item.id]} judge={judge} />
						:
						<NFTToken item={item} key={item.id} judge={judge}/>
						}
					</Grid>);
				
				})}
			</Grid>

		</Container>
	);
}
