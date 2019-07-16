import { context } from '@wikia/ad-engine';
import {
	TrackingTarget,
	postmessageTrackingTracker,
} from '../../../src/ad-tracking/postmessage-tracker';
import { messageBus } from '../../../src/ad-engine/services';

let messageCount = 0;

function setMessageCount(count: number): void {
	document.getElementById('messageCount').innerText = count.toString();
}

document.getElementById('correctMessage').addEventListener(
	'click',
	() => {
		window.postMessage({
			AdEngine: {
				target: TrackingTarget.DataWarehouse,
				payload: { key: 'value' },
			}
		}, window.location.origin);
	},
	false,
);

document.getElementById('correctMessageSerialized').addEventListener(
	'click',
	() => {
		window.postMessage(JSON.stringify({
			AdEngine: {
				target: TrackingTarget.DataWarehouse,
				payload: { key: 'value' },
			}
		}), window.location.origin);
	},
	false,
);

document.getElementById('incorrectMessage').addEventListener(
	'click',
	() => {
		window.postMessage({
			AdEngine: {
				payload: { key: 'value' },
			}
		}, window.location.origin);
	},
	false,
);

context.extend({
	options: {
		tracking: {
			postmessage: true,
		},
	},
});

messageBus.init();

setMessageCount(messageCount);

postmessageTrackingTracker.register((message) => {
	messageCount += 1;
	setMessageCount(messageCount);
	console.log(
		`👁 Tracking listener | target: ${message.target},  payload: ${JSON.stringify(message.payload)}`,
	);
})
