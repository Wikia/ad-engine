import { expect } from 'chai';

import { context } from '../../../../../../../src/ad-engine';
import {
	FandomContext,
	Site,
	Page,
} from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { CombinedStrategy } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/strategies/combined-strategy';

describe('CombinedStrategy execution', () => {
	beforeEach(() => {
		context.set('geo.country', 'PL');
		context.set('wiki.targeting.wikiDbName', 'test');
		context.set('wiki.targeting.wikiVertical', 'test');
	});

	afterEach(() => {
		context.set('geo.country', undefined);
		context.set('wiki.targeting.wikiDbName', undefined);
		context.set('wiki.targeting.wikiVertical', undefined);
	});

	const mockedSkin = 'test';
	const defaultExpectedTargeting = {
		age: [],
		ar: '4:3',
		artid: '666',
		dmn: '',
		esrb: 'ec',
		geo: 'PL',
		gnre: [],
		hostpre: '',
		is_mobile: '0',
		kid_wiki: '1',
		lang: 'pl',
		media: [],
		original_host: 'fandom',
		pform: [],
		pub: [],
		s0: 'lifestyle',
		s0c: [],
		s0v: 'test',
		s1: '_test',
		s2: 'article',
		sex: [],
		skin: 'test',
		theme: [],
		tv: [],
		uap: 'none',
		uap_c: 'none',
		wpage: 'test',
	};

	it('Returns empty tags when site and page tags are empty', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, 'lifestyle'),
			new Page(666, 'pl', 666, 'test', 'all_ads', {}),
		);

		expect(new CombinedStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(
			defaultExpectedTargeting,
		);
	});

	it('Returns tags when site tags are not empty and page tags are empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, 'lifestyle'),
			new Page(666, 'pl', 666, 'test', 'all_ads', {}),
		);
		const expectedTargeting = { ...defaultExpectedTargeting, ...mockedSiteTags };

		expect(new CombinedStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(expectedTargeting);
	});

	it('Returns tags when site tags are empty and page tags are not empty', function () {
		const mockedPageTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, 'lifestyle'),
			new Page(666, 'pl', 666, 'test', 'all_ads', mockedPageTags),
		);
		const expectedTargeting = {
			...defaultExpectedTargeting,
			...{ gnre: ['p_test1', 'p_drama', 'p_comedy', 'p_horror'] },
			...{ theme: ['p_test2', 'p_superheroes'] },
		};

		expect(new CombinedStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(expectedTargeting);
	});

	it('Returns combined tags when site and page tags are not empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test3', 'superheroes'],
		};
		const mockedPageTags = {
			gnre: ['test2', 'drama', 'comedy', 'horror'],
			theme: ['test4', 'superheroes'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, 'lifestyle'),
			new Page(666, 'pl', 666, 'test', 'all_ads', mockedPageTags),
		);
		const expectedTargeting = {
			...defaultExpectedTargeting,
			...{
				gnre: ['test1', 'drama', 'comedy', 'horror', 'p_test2', 'p_drama', 'p_comedy', 'p_horror'],
			},
			...{ theme: ['test3', 'superheroes', 'p_test4', 'p_superheroes'] },
		};

		expect(new CombinedStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(expectedTargeting);
	});
});
