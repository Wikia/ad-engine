import { AdEngine, AdSlot, context, slotService } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.incontent_boxad.trackOverscrolled', true);
context.set('slots.bottom_leaderboard.disabled', false);

slotService.on('incontent_boxad', AdSlot.STATUS_SUCCESS, () => {
	console.info('=== incontent_boxad succeed ===');
});

slotService.on('incontent_boxad', AdSlot.SLOT_VIEWED_EVENT, () => {
	console.info('=== incontent_boxad viewable ===');
});

new AdEngine().init();
