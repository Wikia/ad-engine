import { protocolVersion } from './cross-domain-receiver';

export function iframeMessageFactory(messageType: string, payload?: unknown) {
	return {
		type: messageType,
		timestamp: Date.now(),
		payload: payload,
		xv: protocolVersion,
	};
}
