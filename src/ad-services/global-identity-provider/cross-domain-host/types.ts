export enum StorageStatus {
	Initializing,
	Ready,
}

export interface IframeMessage<T = unknown> {
	type: string;
	timestamp: number;
	payload: T;
	xv: string; // this needs to be identical on both Sender and Receiver
}

export enum SystemMessages {
	REGISTER_REQUEST = 'CrossDomain::Register::Request',
	REGISTER_RESPONSE = 'CrossDomain::Register::Response',
	ADD_MESSAGE_CALLBACKS = 'CrossDomain::AddMessageCallbacks::Request',
}
export type MessageCallback = (message: IframeMessage) => void;

export type MessageCallbackSet = { [key: string]: MessageCallback };
