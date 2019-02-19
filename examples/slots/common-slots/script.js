import { AdEngine, AdSlot, context, slotService } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);

slotService.on('top_leaderboard', AdSlot.STATUS_SUCCESS, () => {
	console.info('top_leaderboard succeed');
});

new AdEngine().init();
