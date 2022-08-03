import { context, Targeting, utils } from '@wikia/ad-engine';

import { CommonStrategy } from './common-strategy';
import { Context } from '../models/context';
import { PageLevelTags } from '../interfaces/page-level-tags';
import { TargetingStrategy } from '../interfaces/targeting-strategy';

export class CombinedStrategy extends CommonStrategy implements TargetingStrategy {
	constructor(private skin: string, private context: Context) {
		super();
	}

	execute(): Partial<Targeting> {
		const wiki: MediaWikiAdsContext = context.get('wiki');

		let targeting: Partial<Targeting> = {
			artid: this.context.page.articleId ? this.context.page.articleId.toString() : '',
			age: this.context.site.tags?.age || [],
			esrb: this.context.site.esrbRating || [],
			kid_wiki: this.context.site.directedAtChildren ? '1' : '0',
			lang: this.context.page.lang || 'unknown',
			s0: this.context.site.vertical,
			s0c: this.context.site.categories,
			s1: utils.targeting.getRawDbName(wiki.targeting.wikiDbName),
			s2: this.getAdLayout(wiki.targeting.pageType || 'article'),
			sex: this.context.page.tags?.sex || [],
			wpage: this.context.page.pageName && this.context.page.pageName.toLowerCase(),
		};

		const pageLevelTags: PageLevelTags = {
			gnre: this.context.page.tags?.gnre || [],
			media: this.context.page.tags?.media || [],
			pform: this.context.page.tags?.pform || [],
			pub: this.context.page.tags?.pub || [],
			theme: this.context.page.tags?.theme || [],
			tv: this.context.page.tags?.tv || [],
		};

		const legacySiteLevelTags = {
			gnre: wiki.targeting?.adTagManagerTags?.gnre || [],
			media: wiki.targeting?.adTagManagerTags?.media || [],
			pform: wiki.targeting?.adTagManagerTags?.pform || [],
			pub: wiki.targeting?.adTagManagerTags?.pub || [],
			theme: wiki.targeting?.adTagManagerTags?.theme || [],
			tv: wiki.targeting?.adTagManagerTags?.tv || [],
		};

		targeting = {
			...targeting,
			...this.combineSiteAndPageTags(legacySiteLevelTags, pageLevelTags),
		};

		if (this.context.site.top1000) {
			targeting.top = '1k';
		}

		return this.addCommonParams(targeting, wiki, this.skin);
	}

	combineSiteAndPageTags(siteTags: PageLevelTags, pageTags: PageLevelTags): PageLevelTags {
		for (const [key, value] of Object.entries(siteTags)) {
			if (Array.isArray(value) && value.length > 0) {
				siteTags[key] = siteTags[key].concat(pageTags[key]);
			}
		}

		return siteTags;
	}
}
