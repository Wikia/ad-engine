import { AdEngine, context } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
// Disable firstCall slots
context.set('slots.top_leaderboard.disabled', true);

new AdEngine().init();
