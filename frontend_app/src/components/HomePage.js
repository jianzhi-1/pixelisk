import React, { Fragment, useEffect, useState } from "react";
import NFTToken from "./NFTToken";
import { Grid } from "@material-ui/core";
import { fetchAllNFTTokens } from "../api";

function HomePage() {
	const [NFTAccounts, setNFTAccounts] = useState([]);
	const [mapper, setMapper] = useState([]);

	useEffect(() => {
		async function fetchData(){setNFTAccounts(await fetchAllNFTTokens());}
		fetchData();
	}, []);

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

	console.log("NFTAccounts here!!")
	console.log(NFTAccounts);
	console.log("MAPPER")
	console.log(mapper)
	//console.log(mapper['body'])

	return (
		<Fragment>
			<Grid container spacing={4}>
				{NFTAccounts.map((item) => (
					<Grid item md={4}>
						{(item.id in mapper)?
						<NFTToken item={item} key={item.id} minimum={true} img={mapper[item.id]} />
						:
						<NFTToken item={item} key={item.id} minimum={true} />
						}
					</Grid>
				))}
			</Grid>
		</Fragment>
	);
}

export default HomePage;
