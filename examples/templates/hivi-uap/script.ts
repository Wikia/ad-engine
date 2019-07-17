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
context.set('targeting.artid', '455');
context.set('options.tracking.slot.status', true);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

setupNpaContext();

templateService.register(BigFancyAdAbove, getBigFancyAdAboveConfig());
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail);

// Register slot tracker
slotTracker
	.add(slotTrackingMiddleware)
	.add(slotPropertiesTrackingMiddleware)
	.register(({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);
	});

new AdEngine().init();
