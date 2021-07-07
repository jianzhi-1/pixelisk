import React, { useState } from "react";
import "../../styles/editor.scss";
import { CirclePicker } from "react-color";
import DrawingPanel from "./DrawingPanel";

export default function Editor(props) {
	const { changeParent } = props;

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
		<div id="editor">
			<h1>Pixel Editor</h1>

			<button onClick={(e) => {initializeDrawingPanel();e.stopPropagation();e.preventDefault()}} className="button">
				{buttonText}
			</button>

			<CirclePicker color={selectedColor} onChangeComplete={changeColor} />

			<DrawingPanel
				width={panelWidth}
				height={panelHeight}
				selectedColor={selectedColor}
				changeParent={changeParent}
			/>
		</div>
	);
}
