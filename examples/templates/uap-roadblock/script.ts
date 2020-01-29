import {
	AdEngine,
	context,
	Roadblock,
	setupNpaContext,
	Skin,
	templateService,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('customContext.targeting.post_id', '1210636');
context.set('customContext.slots.top_boxad.aboveTheFold', false);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

setupNpaContext();

templateService.register(Skin);
templateService.register(Roadblock, {
	slotsToDisable: [],
	slotsToEnable: ['top_leaderboard', 'top_boxad', 'invisible_skin'],
});

new AdEngine().init();
