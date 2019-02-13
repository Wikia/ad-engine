import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { Roadblock, Skin, utils } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.post_id = '1210636';
customContext.slots.top_boxad.aboveTheFold = false;

context.extend(customContext);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

utils.setupNpaContext();

templateService.register(Skin);
templateService.register(Roadblock, {
	slotsToDisable: [],
	slotsToEnable: ['top_leaderboard', 'top_boxad', 'invisible_skin'],
});

new AdEngine().init();
