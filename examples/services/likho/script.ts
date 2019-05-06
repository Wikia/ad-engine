import { AdEngine, context, localCache } from '@wikia/ad-engine';
import { utils } from '@wikia/ad-products';
import { likhoService } from '../../../src/ad-engine/services';
import customContext from '../../context';
import '../../styles.scss';

window.guaTrackEvent = (...args) => {
	console.log(`🛤 Custom tracker: ${args}`);
};

customContext.targeting.artid = '535';
customContext.slots.top_leaderboard.sizes = [
	{
		viewportSize: [728, 0],
		sizes: [[728, 90], [3, 3]],
	},
	{
		viewportSize: [970, 0],
		sizes: [[970, 250], [3, 3]],
	},
];
customContext.targeting.likho = likhoService.refresh();

context.extend(customContext);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

utils.setupNpaContext();

new AdEngine().init();

document.getElementById('reset').addEventListener('click', () => {
	localCache.delete('likho');
	console.log(`💾 Likho storage: reset`);
});
