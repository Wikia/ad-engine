import {
	AdEngine,
	clickPositionTracker,
	context,
	FloorAdhesion,
	templateService,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '158';
customContext.targeting.src = 'test';
customContext.slots.floor_adhesion.clickPositionTracking = true;

context.extend(customContext);

templateService.register(FloorAdhesion);

function registerClickPositionTracker() {
	clickPositionTracker.register(
		(data) => console.log(['🖱️ click on: ', data.label]),
		'floor_adhesion',
	);
}

new AdEngine().init();

registerClickPositionTracker();
