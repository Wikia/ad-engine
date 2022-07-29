import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { context, Targeting, utils } from '@wikia/ad-engine';
import { CommonStrategy } from './common-strategy';
import { Context } from '../models/context';
import { PageLevelTags } from '../interfaces/page-level-tags';

export class PageContextStrategy extends CommonStrategy implements TargetingStrategy {
	constructor(private skin: string, private context: Context) {
		super();
	}

	execute(): Partial<Targeting> {
		const wiki: MediaWikiAdsContext = context.get('wiki');

		let targeting: Partial<Targeting> = {
			age: this.context.page.tags?.age || [],
			artid: this.context.page.articleId ? this.context.page.articleId.toString() : '',
			esrb: this.context.site.esrbRating,
			kid_wiki: this.context.site.directedAtChildren ? '1' : '0',
			lang: this.context.page.lang || 'unknown',
			sex: this.context.page.tags?.sex || [],
			s0: this.context.site.vertical,
			s0c: this.context.site.categories,
			s1: utils.targeting.getRawDbName(this.context.site.siteName),
			s2: this.getAdLayout(this.context.page.pageType || 'article'),
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

		this.addPagePrefixToValues(pageLevelTags);

		targeting = { ...targeting, ...pageLevelTags };

		if (this.context.site.top1000) {
			targeting.top = '1k';
		}

		return this.addCommonParams(targeting, wiki, this.skin);
	}

	addPagePrefixToValues(tags: PageLevelTags): PageLevelTags {
		for (const [key, value] of Object.entries(tags)) {
			if (Array.isArray(value) && value.length > 0) {
				tags[key] = value.map((val) => 'p_' + val);
			}
		}

		return tags;
	}
}
