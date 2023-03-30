import { utils } from '@wikia/core';
import { TargetingProvider } from '../interfaces/targeting-provider';
import { FandomContext } from '../models/fandom-context';
import { OpenRtb2ContentCategories, OpenRtb2Object } from '../models/open-rtb2';

const openRtb2ContentCategoryMap: Record<string, OpenRtb2ContentCategories> = {
	books: OpenRtb2ContentCategories.BOOKS,
	cards: OpenRtb2ContentCategories.CARD_GAMES,
	movie: OpenRtb2ContentCategories.MOVIES,
	movies: OpenRtb2ContentCategories.MOVIES,
	music: OpenRtb2ContentCategories.MUSIC,
	comics: OpenRtb2ContentCategories.COMIC_BOOKS,
	tv: OpenRtb2ContentCategories.TV,
	games: OpenRtb2ContentCategories.GAMES,
	gaming: OpenRtb2ContentCategories.GAMES,
	videogames: OpenRtb2ContentCategories.GAMES,
};

export class OpenRtb2Tags implements TargetingProvider<OpenRtb2Object> {
	private readonly categories: Set<OpenRtb2ContentCategories> =
		new Set<OpenRtb2ContentCategories>();

	constructor(private fandomContext: FandomContext) {}

	get(): OpenRtb2Object {
		const { page, site } = this.fandomContext;

		const categories = this.getCategories(site);
		const keywords = this.getKeywords(site);

		return {
			site: {
				id: page.pageId?.toString(),
				name: page.pageName,
				domain: window.location.hostname,
				cat: categories,
				mobile: utils.client.getDeviceMode() === 'mobile' ? 1 : 0,
				content: {
					language: page.lang,
					context: 5,
				},
				keywords,
			},
			user: {},
		};
	}

	private getCategories(site: FandomContext['site']): OpenRtb2ContentCategories[] {
		const categories = [...site.categories, ...site.taxonomy];
		categories.forEach((category) => this.addCategory(category));

		if (categories.includes('ent')) {
			const tags = site.tags.media ?? [];

			tags.forEach((tag) => this.addCategory(tag));
		}

		return [...this.categories].sort();
	}

	private addCategory(category: string): void {
		const openRtb2ContentCategory = openRtb2ContentCategoryMap[category];

		if (openRtb2ContentCategory) {
			this.categories.add(openRtb2ContentCategory);
		}
	}

	private getKeywords(site: FandomContext['site']): string {
		return [
			...new Set([
				...(site.tags.gnre ?? []),
				...(site.tags.media ?? []),
				...(site.tags.theme ?? []),
				...(site.tags.tv ?? []),
			]),
		]
			.filter(Boolean)
			.sort()
			.join(',');
	}
}
