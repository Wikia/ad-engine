import { AdEngine, context, FmrRotator, utils } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);
context.set('slots.repeatable_boxad_1.avoidConflictWith', undefined);
context.set('slots.repeatable_boxad_1.insertBeforeSelector', '#repeatable_boxad_1');
context.set('slots.repeatable_boxad_1.repeat.limit', 20);
context.set('slots.repeatable_boxad_1.repeat.insertBelowScrollPosition', false);
context.set('slots.repeatable_boxad_1.repeat.disablePushOnScroll', true);

if (utils.queryString.get('recirculation_disabled') === '1') {
	context.set('options.floatingMedrecRecirculationDisabled', true);
}

new AdEngine().init();

const rotator = new FmrRotator('repeatable_boxad_1', 'repeatable_boxad_', null);
rotator.rotateSlot();
