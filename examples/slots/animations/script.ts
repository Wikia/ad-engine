import { AdEngine } from '@wikia/ad-engine';
import context from '../../context';

new AdEngine(context).init();

let action = 'collapse';

setInterval(() => {
	console.info(`Send message "${action}"`);
	window.postMessage(`{"AdEngine":{"action":"${action}","slotName":"top_leaderboard"}}`, '*');
	action = action === 'collapse' ? 'expand' : 'collapse';
}, 5000);
