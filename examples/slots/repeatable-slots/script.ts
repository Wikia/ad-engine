import {
	AdEngine,
	AdSlot,
	btfBlockerService,
	context,
	eventService,
	utils,
} from '@wikia/ad-engine';
import adContext from '../../context';

const contentTemplate = document.querySelector('.content-template').innerHTML;
const mainContainer = document.getElementById('main-container');
const limit = utils.queryString.get('limit') || null;
const contentLength = utils.queryString.get('content_length') || 1;

function loadContent() {
	const newContent = document.createElement('div');

	newContent.innerHTML = contentTemplate;

	mainContainer.appendChild(newContent);
}

eventService.on(AdSlot.SLOT_STATUS_CHANGED, (adSlot) => {
	console.log(`⛳ ${adSlot.getSlotName()}: %c${adSlot.getStatus()}`, 'font-weight: bold');
});

context.extend(adContext);
context.set('slots.repeatable_boxad_1.repeat.limit', limit);
context.set('slots.incontent_player.defaultSizes', [[320, 50]]);

for (let i = 0; i < contentLength; i += 1) {
	loadContent();
}

new AdEngine().init();

btfBlockerService.finishFirstCall();

window.adsQueue.push({
	id: 'repeatable_boxad_1',
});
