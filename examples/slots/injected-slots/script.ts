import { AdEngine, context, slotInjector } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);

slotInjector.inject('injected_boxad');

new AdEngine().init();
