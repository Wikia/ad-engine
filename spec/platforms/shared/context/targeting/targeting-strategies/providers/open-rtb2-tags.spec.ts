import { Dictionary } from '@wikia/core';
import { OpenRtb2ContentCategories, OpenRtb2Object } from '@wikia/platforms/shared';
import {
	FandomContext,
	Page,
	Site,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { OpenRtb2Tags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/open-rtb2-tags';
import { expect } from 'chai';

const pageId = 645;
const pageName = 'test-page';
const pageHostname = 'project43.preview.fandom.com';
const pageLang = 'pl';
const createExpectedOpenRtb2Object = (
	cat: OpenRtb2ContentCategories[] = [],
	tags: Dictionary<string[]> = {},
	mobile: 0 | 1 = 0,
): OpenRtb2Object => {
	const keywords = [...new Set(Object.keys(tags).flatMap((key) => tags[key]))].sort().join(',');

	return {
		site: {
			id: pageId.toString(),
			name: pageName,
			domain: pageHostname,
			cat,
			mobile,
			content: {
				language: pageLang,
				context: 5,
			},
			keywords,
		},
		user: {},
	};
};
const testCases: {
	testName: string;
	categories: string[];
	tags: Dictionary<string[]>;
	taxonomies: string[];
	openRtb2ContentCategories: OpenRtb2ContentCategories[];
}[] = [
	{
		testName: 'empty fandomContext',
		categories: [],
		tags: {},
		taxonomies: [],
		openRtb2ContentCategories: [],
	},
	{
		testName: 'LotR wiki',
		categories: ['ent', 'movies'],
		tags: {
			gnre: ['hackandslash', 'live-action', 'adventure'],
			media: ['cards', 'tv', 'movies', 'games', 'books'],
			theme: ['dragon', 'heroes', 'sword', 'magic'],
			tv: ['amazon'],
		},
		taxonomies: ['ent', 'movies'],
		openRtb2ContentCategories: [
			OpenRtb2ContentCategories.BOOKS,
			OpenRtb2ContentCategories.MOVIES,
			OpenRtb2ContentCategories.TV,
			OpenRtb2ContentCategories.GAMES,
			OpenRtb2ContentCategories.CARD_GAMES,
		],
	},
	{
		testName: 'Harry Potter wiki',
		categories: ['ent', 'movies'],
		tags: {
			gnre: ['live-action', 'war'],
			media: ['movies', 'games', 'books'],
			theme: ['school', 'villains'],
		},
		taxonomies: ['ent', 'movies'],
		openRtb2ContentCategories: [
			OpenRtb2ContentCategories.BOOKS,
			OpenRtb2ContentCategories.MOVIES,
			OpenRtb2ContentCategories.GAMES,
		],
	},
	{
		testName: 'StarWars wiki',
		categories: ['ent', 'tv', 'videogames', 'books', 'comics', 'movies'],
		tags: {
			gnre: ['mmorpg'],
			media: ['movies', 'games', 'books'],
			theme: ['alien', 'villians'],
			tv: ['cn', 'disney'],
		},
		taxonomies: ['ent', 'movies'],
		openRtb2ContentCategories: [
			OpenRtb2ContentCategories.BOOKS,
			OpenRtb2ContentCategories.MOVIES,
			OpenRtb2ContentCategories.TV,
			OpenRtb2ContentCategories.COMIC_BOOKS,
			OpenRtb2ContentCategories.GAMES,
		],
	},
	{
		testName: 'U2 wiki',
		categories: ['music'],
		tags: {
			gnre: ['singing'],
			media: ['music', 'web', 'tv', 'movies', 'games', 'books'],
			theme: ['documentary', 'music'],
		},
		taxonomies: ['ent', 'music'],
		openRtb2ContentCategories: [
			OpenRtb2ContentCategories.BOOKS,
			OpenRtb2ContentCategories.MOVIES,
			OpenRtb2ContentCategories.MUSIC,
			OpenRtb2ContentCategories.TV,
			OpenRtb2ContentCategories.GAMES,
		],
	},
	{
		testName: 'FIFA wiki',
		categories: ['gaming'],
		tags: {
			gnre: ['esports', 'sports'],
			media: ['games'],
			theme: ['soccer'],
		},
		taxonomies: ['gaming', 'games'],
		openRtb2ContentCategories: [OpenRtb2ContentCategories.GAMES],
	},
];

describe('OpenRtb2Tags', () => {
	beforeEach(() => {
		global.sandbox.stub(window, 'location').value({
			hostname: pageHostname,
		});
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: () => ({ matches: false }),
		});
	});

	testCases.forEach(({ testName, categories, tags, taxonomies, openRtb2ContentCategories }) =>
		it(`should return OpenRtb2Tags correctly for ${testName}`, () => {
			// given
			const mockedContext: FandomContext = new FandomContext(
				new Site(categories, true, 'test', false, tags, taxonomies),
				new Page(666, pageLang, pageId, pageName, 'article-test', {}, 546),
			);
			const openRtb2Tags = new OpenRtb2Tags(mockedContext);
			const expectedOpenRtb2Object = createExpectedOpenRtb2Object(openRtb2ContentCategories, tags);

			// when
			const openRtb2Object = openRtb2Tags.get();

			// then
			expect(openRtb2Object).to.deep.equal(expectedOpenRtb2Object);
		}),
	);
});
