import {
	AdEngine,
	BigFancyAdAbove,
	BigFancyAdBelow,
	context,
	FloatingRail,
	setupNpaContext,
	templateService,
} from '@wikia/ad-engine';

import { getConfig as getBigFancyAdAboveConfig } from '../../big-fancy-ad-above-config';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '455';

context.extend(customContext);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

setupNpaContext();

context.push('listeners.slot', {
	onStatusChanged: (adSlot) => {
		console.log(`⛳ ${adSlot.getSlotName()}: %c${adSlot.getStatus()}`, 'font-weight: bold');
	},
	onImpressionViewable: (adSlot) => {
		console.log(`⛳ ${adSlot.getSlotName()}: %cviewed`, 'font-weight: bold');
	},
});

templateService.register(BigFancyAdAbove, getBigFancyAdAboveConfig());
templateService.register(BigFancyAdBelow, {
	stickinessAllowed: true,
});
templateService.register(FloatingRail);

new AdEngine().init();
