import { MessageType } from './messages';
import { iframeMessageFactory, initializeCrossDomainStorage } from './cross-domain-host';
import { utils } from '@ad-engine/core';

const messageCallbacks = {
	[MessageType.PPID_REQUEST]: () => {
		const beacon = localStorage.getItem('ppid');
		utils.logger('PPID', 'GOT PPID');
		receiver.respond(iframeMessageFactory(MessageType.PPID_RESPONSE, beacon));
		return;
	},
};

const receiver = initializeCrossDomainStorage(messageCallbacks);
