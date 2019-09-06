import { AdEngine, context, taxonomyService, utils } from '@wikia/ad-engine';
import adContext from '../../context';

const isEnabled = utils.queryString.get('taxonomy-disabled') !== '1';
const communityId = utils.queryString.get('community-id') || 'aa746ead3a810cdf7dd11b4779c53009';

context.extend(adContext);
context.set('services.taxonomy.enabled', isEnabled);
context.set('services.taxonomy.communityId', communityId);
context.push('delayModules', taxonomyService);

taxonomyService.configurePageLevelTargeting().then((adTags) => {
	document.getElementById('adTags').innerText = JSON.stringify(adTags);
});

new AdEngine().init();
