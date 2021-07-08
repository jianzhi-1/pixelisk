import React, { useRef } from "react";
import "../../styles/drawingPanel.scss";
import Row from "./Row";
import { exportComponentAsPNG } from "react-component-export-image";
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom';
import {
	Button,
} from "@material-ui/core";

const saveAs = (uri, filename) => {
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
};

export default function DrawingPanel(props) {
	const { width, height, selectedColor, changeParent, changeDisableSend } = props;

	const panelRef = useRef();

	let rows = [];

	for (let i = 0; i < height; i++) {
		rows.push(<Row key={i} width={width} selectedColor={selectedColor} />);
	}

	console.log("HERE")

	return (
		<div id="drawingPanel">
			<div id="pixels" ref={panelRef}>
				{rows}
			</div>

			<div>
				<Button 
				style={{marginRight:"10px"}}
				variant="contained" 
				onClick={(e) => {
					var x = html2canvas(ReactDOM.findDOMNode(panelRef.current),
						{scrollY: -window.scrollY, useCORS: true,})
					.then(canvas => {
						var y = canvas.toDataURL('image/png', 1.0)
						changeParent(y);
						changeDisableSend(false);
						return canvas;
					});
					e.stopPropagation();
					e.preventDefault();
				}}>
					save
				</Button>
				
				<Button 
				variant="contained" 
				onClick={(e) => {
					exportComponentAsPNG(panelRef);
					var x = html2canvas(ReactDOM.findDOMNode(panelRef.current), {
						scrollY: -window.scrollY,useCORS: true,})
					.then(canvas => {
						var y = canvas.toDataURL('image/png', 1.0)
						changeParent(y);
						changeDisableSend(false);
						return canvas;});
					e.stopPropagation();
					e.preventDefault();
				}}
				>
					save to local
				</Button>
			</div>
		</div>
	);
}
