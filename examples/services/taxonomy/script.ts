import { AdEngine, context, taxonomyService, utils } from '@wikia/ad-engine';
import adContext from '../../context';

const isEnabled = utils.queryString.get('taxonomy-disabled') !== '1';
const isGettingComicsTagEnabled = utils.queryString.get('taxonomy-comics-disabled') !== '1';
const communityId = utils.queryString.get('community-id') || 'aa746ead3a810cdf7dd11b4779c53009';
const pageArticleId = utils.queryString.get('page-article-id') || '';

context.extend(adContext);
context.set('services.taxonomy.enabled', isEnabled);
context.set('services.taxonomy.comics.enabled', isGettingComicsTagEnabled);
context.set('services.taxonomy.communityId', communityId);
context.set('services.taxonomy.pageArticleId', pageArticleId);
context.push('delayModules', taxonomyService);

taxonomyService.configurePageLevelTargeting().then((adTags) => {
	document.getElementById('adTags').innerText = JSON.stringify(adTags);
});

if (pageArticleId) {
	taxonomyService.configureComicsTargeting().then((comicsTag) => {
		document.getElementById('comicsTag').innerText = JSON.stringify(comicsTag);
	});
} else {
	document.getElementById('comicsTag').innerText =
		'To get comics tag, add community-id and page-article-id in query string.';
}

new AdEngine().init();
