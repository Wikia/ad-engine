import { expect } from 'chai';

import { context } from '../../../../../../../src/core';
import {
	FandomContext,
	Site,
	Page,
} from '../../../../../../../src/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { PageContextStrategy } from '../../../../../../../src/platforms/shared/context/targeting/targeting-strategies/strategies/page-context-strategy';

describe('PageContextStrategy execution', () => {
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
		bundles: [],
		dmn: '',
		rating: 'esrb:ec,mpa:general',
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
		s2: 'article-test',
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
			new Site([], true, 'ec', 'test', false, {}, 'lifestyle', 'general'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		expect(new PageContextStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(
			defaultExpectedTargeting,
		);
	});

	it('Returns empty tags when site tags are not empty and page tags are empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, 'lifestyle', 'general'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		expect(new PageContextStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(
			defaultExpectedTargeting,
		);
	});

	it('Returns tags when site tags are empty and page tags are not empty', function () {
		const mockedPageTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, 'lifestyle', 'general'),
			new Page(666, 'pl', 666, 'test', 'article-test', mockedPageTags),
		);
		const expectedTargeting = {
			...defaultExpectedTargeting,
			...{ gnre: ['p_test1', 'p_drama', 'p_comedy', 'p_horror'] },
			...{ theme: ['p_test2', 'p_superheroes'] },
		};

		expect(new PageContextStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(
			expectedTargeting,
		);
	});

	it('Returns correct tags when site and page tags are not empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test3', 'superheroes'],
			bundles: ['site-bundle'],
		};
		const mockedPageTags = {
			gnre: ['test2', 'drama', 'comedy', 'horror'],
			theme: ['test4', 'superheroes'],
			bundles: ['page-bundle'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, 'lifestyle', 'general'),
			new Page(666, 'pl', 666, 'test', 'article-test', mockedPageTags),
		);
		const expectedTargeting = {
			...defaultExpectedTargeting,
			...{
				gnre: ['p_test2', 'p_drama', 'p_comedy', 'p_horror'],
			},
			...{ theme: ['p_test4', 'p_superheroes'] },
			...{ bundles: ['page-bundle'] },
		};

		expect(new PageContextStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(
			expectedTargeting,
		);
	});
});
