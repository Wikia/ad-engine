import { context, Targeting, utils } from '@wikia/ad-engine';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { CommonStrategy } from './common-strategy';

export class LegacyStrategy extends CommonStrategy implements TargetingStrategyInterface {
	constructor(private skin: string) {
		super();
	}

	private createRatingTag(wiki: MediaWikiAdsContext) {
		const tags = [];

		wiki.targeting.esrbRating ? tags.push('esrb:' + wiki.targeting.esrbRating) : null;
		wiki.targeting.mpaRating ? tags.push('mpa:' + wiki.targeting.mpaRating) : null;
		return tags.join(',');
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing LegacyStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		const targeting: Partial<Targeting> = {
			artid: wiki.targeting.pageArticleId ? wiki.targeting.pageArticleId.toString() : '',
			age: wiki.targeting?.adTagManagerTags?.age || [],
			bundles: wiki.targeting?.adTagManagerTags?.bundles || [],
			gnre: wiki.targeting?.adTagManagerTags?.gnre || [],
			kid_wiki: wiki.targeting.directedAtChildren ? '1' : '0',
			lang: wiki.targeting.wikiLanguage || 'unknown',
			media: wiki.targeting?.adTagManagerTags?.media || [],
			pform: wiki.targeting?.adTagManagerTags?.pform || [],
			pub: wiki.targeting?.adTagManagerTags?.pub || [],
			s0: wiki.targeting.mappedVerticalName,
			s0c: wiki.targeting.newWikiCategories,
			s1: utils.targeting.getRawDbName(wiki.targeting.wikiDbName),
			s2: this.getAdLayout(wiki.targeting.pageType || 'article'),
			sex: wiki.targeting?.adTagManagerTags?.sex || [],
			theme: wiki.targeting?.adTagManagerTags?.theme || [],
			tv: wiki.targeting?.adTagManagerTags?.tv || [],
			wpage: wiki.targeting.pageName && wiki.targeting.pageName.toLowerCase(),
		};

		if (wiki.targeting.mpaRating || wiki.targeting.esrbRating) {
			targeting.rating = this.createRatingTag(wiki);
		}

		if (wiki.targeting.wikiIsTop1000) {
			targeting.top = '1k';
		}

		return this.addCommonParams(targeting, wiki, this.skin);
	}
}
