import {
	AdEngine,
	clickPositionTracker,
	context,
	FloorAdhesion,
	templateService,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('customContext.targeting.artid', '158');
context.set('customContext.targeting.src', 'test');
context.set('customContext.slots.floor_adhesion.clickPositionTracking', true);

templateService.register(FloorAdhesion);

function registerClickPositionTracker() {
	clickPositionTracker.register(
		(data) => console.log(['🖱️ click on: ', data.label]),
		'floor_adhesion',
	);
}

new AdEngine().init();

registerClickPositionTracker();
