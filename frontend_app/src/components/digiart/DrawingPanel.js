import React, { useRef } from "react";
import "../../styles/drawingPanel.scss";
import Row from "./Row";
import { exportComponentAsPNG } from "react-component-export-image";
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom';

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
	const { width, height, selectedColor, changeParent } = props;

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
		
		<button onClick={(e) => {console.log(e);exportComponentAsPNG(panelRef);
			console.log(panelRef);
			var x = html2canvas(ReactDOM.findDOMNode(panelRef.current), {        scrollY: -window.scrollY,
				useCORS: true,}).then(canvas => {
					console.log(canvas);
					var y = canvas.toDataURL('image/png', 1.0)
					console.log("y: ", y);
					changeParent(y);
					return canvas;});
			console.log("x: ",x);
			e.stopPropagation();e.preventDefault()}} className="button">
			save a copy
		</button>
		</div>
	);
}
