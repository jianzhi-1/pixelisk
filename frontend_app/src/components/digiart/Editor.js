import React, { useState } from "react";
import "../../styles/editor.scss";
import { CompactPicker, CirclePicker } from "react-color";
import DrawingPanel from "./DrawingPanel";

export default function Editor(props) {
	const { changeParent, changeDisableSend } = props;

	const [panelWidth, setPanelWidth] = useState(16);
	const [panelHeight, setPanelHeight] = useState(16);
	const [hideOptions, setHideOptions] = useState(true);
	const [hideDrawingPanel, setHideDrawingPanel] = useState(false);
	const [buttonText, setButtonText] = useState("start drawing");
	const [selectedColor, setColor] = useState("#f44336");

	function initializeDrawingPanel() {
		setHideOptions(!hideOptions);
		setHideDrawingPanel(!hideDrawingPanel);
		console.log("START DRAWING")

		buttonText === "start drawing"
		? setButtonText("reset")
		: setButtonText("start drawing");
		console.log("end init drawing panel")
	}

	function changeColor(color) {
		setColor(color.hex);
	}

	return (
		<div id="editor" style={{backgroundColor:"#f2f3ff"}}>
			<h3>Design your Pix below!</h3>
			<CompactPicker color={selectedColor} onChangeComplete={changeColor} />
			<br></br>
			<br></br>
			<DrawingPanel
				width={panelWidth}
				height={panelHeight}
				selectedColor={selectedColor}
				changeParent={changeParent}
				changeDisableSend={changeDisableSend}
			/>
		</div>
	);
}
