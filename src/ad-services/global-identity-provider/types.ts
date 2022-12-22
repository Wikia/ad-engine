export interface IframeMessage<T = unknown> {
	type: string;
	timestamp: number;
	payload: T;
	xv: string; // this needs to be identical on both Sender and Receiver
}
