import { AdEngine, context, viewabilityCounter } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);

viewabilityCounter.init();

console.info(`👀 Overall viewability: ${viewabilityCounter.getViewability()}`);
console.info(`👀 TLB viewability: ${viewabilityCounter.getViewability('top_leaderboard')}`);
console.info(`👀 BLB viewability: ${viewabilityCounter.getViewability('bottom_leaderboard')}`);

new AdEngine().init();
