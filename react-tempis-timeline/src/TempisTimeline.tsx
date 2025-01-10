import * as React from "react";

import './tempis-timeline.css';

export type TempisTimelineProps = {
};

export type TempisTimelineState = {
};

/**
 * The TempisTimeline component.
 */
export class TempisTimeline extends React.Component<TempisTimelineProps, TempisTimelineState> {

    private readonly _canvasRef: React.RefObject<HTMLCanvasElement | null>;

	/**
	 * Creates the TempisTimeline element.
	 * @param props The control properties.
	 */
	public constructor(props: TempisTimelineProps) {
		super(props);

		// Set the initial state for the component.
		this.state = {};

        this._canvasRef = React.createRef<HTMLCanvasElement>();

        console.log('updated');
	}

	/**
	 * Renders the component.
	 */
	public render(): React.ReactNode {
		return (
			<div className="tempis-timeline">
                <p>Timeline</p>
                <canvas ref={this._canvasRef} className="tempis-timeline-canvas" width="600" height="400"></canvas>
            </div>
		);
	}

    public componentDidUpdate(prevProps: TempisTimelineProps, prevState: TempisTimelineState) {
        console.log('updated');
    }

    public componentDidMount() {
        // Get a reference to the canvas.
        const canvas = this._canvasRef.current!;
        
        // Get the canvas context.
        const context = canvas.getContext('2d')!;
    
        context.fillStyle = '#000000';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
}