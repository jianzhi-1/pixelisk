import React from 'react';
const notfound = require('../public/notfound200.png');

export default function NotFoundPage(props) {
	console.log("AT NOT FOUND PAGE!!")
	console.log(props)
	var msg = "The page you have requested does not exist."
	var name = "404 Page Not Found";
	console.log(props)
	if ("location" in props){
		if ("state" in props.location){
			if (props.location.state && "msg" in props.location.state && "name" in props.location.state){
				msg = props.location.state.msg;
				name = props.location.state.name;
			}
		}
	}

	return (
		<div style={{    display: "flex",
		justifyContent: "center",
		alignItems: "center",
		}}>
			<div style={{marginRight:"20px"}}>
				<img src={notfound} width={200}/>
			</div>
			<div>
				<h1 style={{color:"red"}}>ERROR</h1>
				<div>{name}</div>
				<div>{msg}</div>
			</div>
		</div>
	);
}
