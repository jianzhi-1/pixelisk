import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	Link,
	Divider,
	Button,
	Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { transactions, cryptography, Buffer } from "@liskhq/lisk-client";

import PurchaseNFTTokenDialog from "./dialogs/PurchaseNFTTokenDialog";
import TransferNFTDialog from "./dialogs/TransferNFTDialog";
import VoteNFTDialog from "./dialogs/VoteNFTDialog";
import ReclaimNFTDialog from "./dialogs/ReclaimNFTDialog";

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

export default function NFTToken(props) {
	const classes = useStyles();
	const [openPurchase, setOpenPurchase] = useState(false);
	const [openTransfer, setOpenTransfer] = useState(false);
	const [openVote, setOpenVote] = useState(false);
	const [openReclaim, setOpenReclaim] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.ownerAddress, 'hex'), 'lsk').toString('binary');
	
	var base32CreatorAddress = "-";
	if ("creatorAddress" in props.item && props.item["creatorAddress"] != null && props.item["creatorAddress"].length > 30){
		base32CreatorAddress = cryptography.getBase32AddressFromAddress(Buffer.from(props.item.creatorAddress, 'hex'), 'lsk').toString('binary');
	}
	
	return (
		<Card>
			<CardContent>
				<Typography variant="h6">{props.item.name}</Typography>
				<Divider />
				<dl className={classes.propertyList}>
				<li>
					{/*<dt>Image</dt>*/}
					{'img' in props?
						<img src={props['img']}/>
						:
						<dd>NO IMAGE</dd>
					}
					
				</li>
				{!props.mini?
				<li>
					<b>Pix Value:</b> {transactions.convertBeddowsToLSK(props.item.value)} LSK
					<dd></dd>
				</li>:
				null}

				{(!props.mini && !showDetails)?
				<li>
					<dt>Owner</dt>
					<Box 
					textOverflow="ellipsis"
					component="div"
					overflow="auto"
					>
						<dd>
							<Link
							component={RouterLink}
							to={`/accounts/${base32UIAddress}`}
							>
							{base32UIAddress}
							</Link>
						</dd>
					</Box>
				</li>
				:null}

				{(!props.mini && !props.minimum)?
				<div>

				{showDetails?
				
					<div>

					{!props.minimum && (
						<li>
							<b>Min Purchase Margin:</b> {props.item.minPurchaseMargin} LSK
							<dd></dd>
						</li>
					)}

					<li>
						<dt>Owner</dt>
						<Box 
						textOverflow="ellipsis"
						component="div"
						overflow="auto"
						>
							<dd>
								<Link
								component={RouterLink}
								to={`/accounts/${base32UIAddress}`}
								>
								{base32UIAddress}
								</Link>
							</dd>
						</Box>
					</li>

					{!props.minimum && (
					<li>
						<dt>Creator</dt>
						<Box 
						textOverflow="ellipsis"
						component="div"
						overflow="auto"
						>
							<dd>
								<Link
								component={RouterLink}
								to={`/accounts/${base32CreatorAddress}`}
								>
								{base32CreatorAddress}
								</Link>
							</dd>
						</Box>
					</li>
					)}

					{!props.minimum && (
						<li>
							<dt>Pix ID</dt>
							<Box 
							textOverflow="ellipsis"
							component="div"
							overflow="auto"
							>
								<dd>
								{props.item.id}
								</dd>
							</Box>
							
						</li>
					)}
					</div>
				:
					<li>
						<Button onClick={() => setShowDetails(true)}>
						Show Details
						</Button>
					</li>
				}
				</div>

				:
				null

				}


				{/*!props.minimum && (
					<li>
					<dt>Minimum stuff</dt>
					<dd>
						<Link
						component={RouterLink}
						to={`/accounts/${base32UIAddress}`}
						>
						{base32UIAddress}
						</Link>
					</dd>
					</li>
				)*/}
				</dl>

				{/*
				<Typography variant="h6">NFT History</Typography>
				<Divider />
				{props.item.tokenHistory.map((base32UIAddress) => (
				<dl className={classes.propertyList}>
					<li>
					<dd>
						<Link
						component={RouterLink}
						to={`/accounts/${base32UIAddress}`}
						>
						{base32UIAddress}
						</Link>
					</dd>
					</li>
				</dl>
				))}
				*/}

			</CardContent>

			{!props.mini?
			<div>

			{props.judge?
			<CardActions>
				<>
				<Button
				size="small"
				color="primary"
				onClick={() => {setOpenVote(true);}}
				>
					Vote Pix
				</Button>

				<VoteNFTDialog
				open={openVote}
				handleClose={() => {setOpenVote(false);}}
				token={props.item}
				/>

				</>

				<>
				<Button
				size="small"
				color="primary"
				onClick={() => {setOpenReclaim(true);}}
				>
					Reclaim Pix
				</Button>

				<ReclaimNFTDialog
				open={openReclaim}
				handleClose={() => {setOpenReclaim(false);}}
				token={props.item}
				/>

				</>
				{/*
				{props.item.minPurchaseMargin > 0 ? (
				<>
					<Button
					size="small"
					color="primary"
					onClick={() => {setOpenPurchase(true);}}
					>
						Purchase NFT
					</Button>

					<PurchaseNFTTokenDialog
					open={openPurchase}
					handleClose={() => {setOpenPurchase(false);}}
					token={props.item}
					/>
				</>
				) : (
				<Typography variant="body">Can't purchase this token</Typography>
				)}
				*/}
			</CardActions>

			:

			<CardActions>
				<>
				<Button
				size="small"
				color="primary"
				onClick={() => {setOpenTransfer(true);}}
				>
					Transfer Pix
				</Button>

				<TransferNFTDialog
				open={openTransfer}
				handleClose={() => {setOpenTransfer(false);}}
				token={props.item}
				/>

				</>
				{props.item.minPurchaseMargin > 0 ? (
				<>
					<Button
					size="small"
					color="primary"
					onClick={() => {setOpenPurchase(true);}}
					>
						Purchase Pix
					</Button>

					<PurchaseNFTTokenDialog
					open={openPurchase}
					handleClose={() => {setOpenPurchase(false);}}
					token={props.item}
					/>
				</>
				) : (
				<Typography variant="body">Can't purchase this token</Typography>
				)}
			</CardActions>
		}
		</div>
		:
		null
		}
		</Card>
	);
}
