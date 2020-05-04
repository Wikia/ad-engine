import {
	AdEngine,
	AdInfoContext,
	BigFancyAdAbove,
	BigFancyAdBelow,
	context,
	FloatingRail,
	setupNpaContext,
	slotPropertiesTrackingMiddleware,
	slotTracker,
	slotTrackingMiddleware,
	templateService,
} from '@wikia/ad-engine';

import { getConfig as getBigFancyAdAboveConfig } from '../../big-fancy-ad-above-config';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);

const cid = context.get('targeting.cid');

if (!cid) {
	context.set('targeting.cid', 'adeng-uap-hivi-dev');
}
context.set('options.tracking.slot.status', true);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
	context.set('slots.bottom_leaderboard.viewportConflicts', []);
}

setupNpaContext();

templateService.register(BigFancyAdAbove, getBigFancyAdAboveConfig());
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail);

// Register slot tracker
slotTracker
	.add(slotTrackingMiddleware)
	.add(slotPropertiesTrackingMiddleware)
	.register(async ({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);

		return { data, slot };
	});

new AdEngine().init();
