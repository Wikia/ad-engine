import { AdEngine, AdSlot, eventService, slotService } from '@wikia/ad-engine';
import adContext from '../../context';

const article = document.querySelector('.main');

document.getElementById('addParagraph').addEventListener('click', () => {
	const paragraph = document.createElement('p');

	paragraph.innerText =
		'Sea necessitatibus vituperatoribus ex, mei commune deserunt necessitatibus ad, illud ' +
		'adolescens conclusionemque has ei. Appetere convenire an eam, in nam case nonumes, ' +
		'idque apeirian usu ea. Corpora fastidii definitiones mea cu, qui ei natum mutat fierent, ei ' +
		'mollis suscipit corrumpit mei. No iriure tincidunt sed, putent pertinax nec ad. No nihil ' +
		'vivendum disputationi sea, vel id enim vivendo, mea tota intellegebat ut.';

	article.appendChild(paragraph);
});

document.getElementById('hideTopBoxad').addEventListener('click', () => {
	slotService.get('top_boxad').collapse();
});

eventService.on(AdSlot.SLOT_STATUS_CHANGED, (adSlot) => {
	console.log(`⛳ ${adSlot.getSlotName()}: %c${adSlot.getStatus()}`, 'font-weight: bold');
});

adContext.slots.bottom_leaderboard.disabled = false;

new AdEngine(adContext).init();
