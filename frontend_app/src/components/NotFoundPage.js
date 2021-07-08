import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { getAllTransactions } from "../api";
import { cryptography, Buffer } from '@liskhq/lisk-client';


export default function NotFoundPage(props) {
	console.log("AT NOT FOUND PAGE!!")
	console.log(props)
	var msg = "The page you have requested does not exist."
	var name = "404 Page Not Found";
	if ("location" in props && "state" in props.location){
		msg = props.location.state.msg;
		name = props.location.state.name;
	}

	return (
		<div>
			<h1 style={{color:"red"}}>ERROR</h1>
			<div>{name}</div>
			<div>{msg}</div>
		</div>
	);
}
