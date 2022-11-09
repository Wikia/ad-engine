import { context, Targeting, utils } from '@wikia/ad-engine';

import { CommonStrategy } from './common-strategy';
import { createTaxonomyTags } from '../factories/create-taxonomy-tags';
import { TaxonomyTags } from '../interfaces/taxonomy-tags';
import { TargetingStrategyInterface } from '../interfaces/targeting-strategy';
import { FandomContext, Site } from '../models/fandom-context';

export class CombinedStrategy extends CommonStrategy implements TargetingStrategyInterface {
	constructor(private skin: string, private context: FandomContext) {
		super();
	}

	private createRatingTag(site: Site) {
		const ratingTags = [];

		site.esrbRating ? ratingTags.push('esrb:' + site.esrbRating) : null;
		site.mpaRating ? ratingTags.push('mpa:' + site.mpaRating) : null;
		return ratingTags.join(',');
	}

	execute(): Partial<Targeting> {
		utils.logger('Targeting', 'Executing CombinedStrategy...');

		const wiki: MediaWikiAdsContext = context.get('wiki');

		let targeting: Partial<Targeting> = {
			age: this.context.site.tags?.age || [],
			artid: this.context.page.articleId ? this.context.page.articleId.toString() : '',
			bundles: CombinedStrategy.getCombinedBundles(this.context),
			kid_wiki: this.context.site.directedAtChildren ? '1' : '0',
			lang: this.context.page.lang || 'unknown',
			sex: this.context.site.tags?.sex || [],
			s0: this.context.site.vertical,
			s0c: this.context.site.categories,
			s1: utils.targeting.getRawDbName(this.context.site.siteName),
			s2: this.getAdLayout(this.context.page.pageType || 'article'),
			wpage: this.context.page.pageName && this.context.page.pageName.toLowerCase(),
		};

		const pageLevelTags: TaxonomyTags = createTaxonomyTags(this.context.page.tags);
		const siteLevelTags: TaxonomyTags = createTaxonomyTags(this.context.site.tags);

		this.addPagePrefixToValues(pageLevelTags);

		targeting = {
			...targeting,
			...this.combineSiteAndPageTags(siteLevelTags, pageLevelTags),
		};

		if (this.context.site.mpaRating || this.context.site.esrbRating) {
			targeting.rating = this.createRatingTag(this.context.site);
		}

		if (this.context.site.top1000) {
			targeting.top = '1k';
		}

		return this.addCommonParams(targeting, wiki, this.skin);
	}

	combineSiteAndPageTags(siteTags: TaxonomyTags, pageTags: TaxonomyTags): TaxonomyTags {
		const combinedTags: TaxonomyTags = {};

		for (const [key, value] of Object.entries(siteTags)) {
			if (Array.isArray(value) && value.length > 0) {
				combinedTags[key] = siteTags[key].concat(pageTags[key]);
			} else if (Array.isArray(value) && value.length === 0) {
				combinedTags[key] = pageTags[key];
			}
		}

		return combinedTags;
	}

	private static getCombinedBundles(context: FandomContext): string[] {
		const bundles = context.site.tags?.bundles || [];
		if (context.page.tags?.bundles) {
			context.page.tags.bundles.forEach((bundle) => {
				if (!utils.targeting.containsValue(bundles, bundle)) {
					bundles.push(bundle);
				}
			});
		}
		return bundles;
	}
}
