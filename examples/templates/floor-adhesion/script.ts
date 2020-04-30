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
context.set('targeting.artid', '158');
context.set('targeting.src', 'test');
context.set('slots.floor_adhesion.clickPositionTracking', true);

templateService.register(FloorAdhesion);

function registerClickPositionTracker() {
	clickPositionTracker.register(async (data) => {
		console.log(['🖱️ click on: ', data.label]);

		return data;
	}, 'floor_adhesion');
}

new AdEngine().init();

registerClickPositionTracker();
