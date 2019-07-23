import {
	AdEngine,
	AdInfoContext,
	AdSlot,
	AdViewabilityContext,
	context,
	slotBiddersTrackingMiddleware,
	slotBillTheLizardStatusTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotService,
	slotTracker,
	slotTrackingMiddleware,
	viewabilityPropertiesTrackingMiddleware,
	viewabilityTracker,
	viewabilityTrackingMiddleware,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);
context.set('options.tracking.slot.status', true);
context.set('options.tracking.slot.viewability', true);

slotService.on('top_leaderboard', AdSlot.STATUS_SUCCESS, () => {
	console.info('top_leaderboard succeed');
});

// Register slot tracker
slotTracker
	.add(slotTrackingMiddleware)
	.add(slotPropertiesTrackingMiddleware)
	.add(slotBiddersTrackingMiddleware)
	.add(slotBillTheLizardStatusTrackingMiddleware)
	.register(({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);
	});

viewabilityTracker
	.add(viewabilityTrackingMiddleware)
	.add(viewabilityPropertiesTrackingMiddleware)
	.register(({ data, slot }: AdViewabilityContext) => {
		// Trigger event tracking
		console.info(`👀 Viewability tracker: ${slot.getSlotName()}`, data);
	});

new AdEngine().init();
