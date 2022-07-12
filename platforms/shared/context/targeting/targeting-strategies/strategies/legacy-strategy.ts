import { context, Targeting, utils } from '@wikia/ad-engine';
import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { CommonStrategy } from './common-strategy';

export class LegacyStrategy extends CommonStrategy implements TargetingStrategy {
	constructor(private skin: string) {
		super();
	}

	execute(): Partial<Targeting> {
		const wiki: MediaWikiAdsContext = context.get('wiki');

		const targeting: Partial<Targeting> = {
			artid: wiki.targeting.pageArticleId ? wiki.targeting.pageArticleId.toString() : '',
			age: wiki.targeting?.adTagManagerTags?.age || [],
			esrb: wiki.targeting.esrbRating,
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

		if (wiki.targeting.wikiIsTop1000) {
			targeting.top = '1k';
		}

		return this.addCommonParams(targeting, wiki, this.skin);
	}
}
