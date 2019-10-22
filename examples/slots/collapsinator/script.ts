import {
	AdEngine,
	AdInfoContext,
	context,
	slotBiddersTrackingMiddleware,
	slotBillTheLizardStatusTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTracker,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);
context.set('options.tracking.slot.status', true);

slotTracker
	.add(slotTrackingMiddleware)
	.add(slotPropertiesTrackingMiddleware)
	.add(slotBiddersTrackingMiddleware)
	.add(slotBillTheLizardStatusTrackingMiddleware)
	.register(({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);
	});

new AdEngine().init();
