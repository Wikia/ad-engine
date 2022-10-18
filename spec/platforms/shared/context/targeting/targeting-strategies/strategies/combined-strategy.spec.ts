import { expect } from 'chai';

import { context } from '@wikia/core';
import {
	FandomContext,
	Site,
	Page,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { createSelectedStrategy } from '@wikia/platforms/shared/context/targeting/targeting-strategies/factories/create-selected-strategy';
import { TargetingStrategy } from '@wikia/platforms/shared/context/targeting/targeting-strategies/interfaces/targeting-strategy';

describe('CombinedStrategy', () => {
	const mockedSkin = 'test';
	const mockedTaxonomy = ['life', 'lifestyle'];
	const mockedCommonParams = {
		ar: '4:3',
		artid: '666',
		dmn: '',
		esrb: 'ec',
		geo: 'PL',
		hostpre: '',
		is_mobile: '0',
		kid_wiki: '1',
		lang: 'pl',
		original_host: 'fandom',
		s0: mockedTaxonomy[0],
		s0c: [],
		s0v: mockedTaxonomy[1],
		s1: '_test',
		s2: 'article-test',
		skin: 'test',
		uap: 'none',
		uap_c: 'none',
		wpage: 'test',
	};

	beforeEach(() => {
		context.set('geo.country', 'PL');
	});

	afterEach(() => {
		context.set('geo.country', undefined);
	});

	it('sets up targeting correctly when taxonomy tags are empty', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, mockedTaxonomy, 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		const expectedTaxonomyTags = {
			age: [],
			bundles: [],
			gnre: [],
			media: [],
			pform: [],
			pub: [],
			sex: [],
			theme: [],
			tv: [],
		};

		const expectedResult = { ...mockedCommonParams, ...expectedTaxonomyTags };

		const combinedStrategy = createSelectedStrategy(
			TargetingStrategy.COMBINED,
			mockedContext,
			mockedSkin,
		);

		expect(combinedStrategy.get()).to.deep.eq(expectedResult);
	});

	it('sets up targeting correctly when site tags are not empty and page tags are empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
			tv: ['test1', 'movie'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, mockedTaxonomy, 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		const expectedTaxonomyTags = {
			age: [],
			bundles: [],
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			media: [],
			pform: [],
			pub: [],
			sex: [],
			theme: ['test2', 'superheroes'],
			tv: ['test1', 'movie'],
		};

		const expectedResult = { ...mockedCommonParams, ...expectedTaxonomyTags };

		const combinedStrategy = createSelectedStrategy(
			TargetingStrategy.COMBINED,
			mockedContext,
			mockedSkin,
		);

		expect(combinedStrategy.get()).to.deep.eq(expectedResult);
	});

	it('sets up targeting correctly when site tags are empty and page tags are not empty', function () {
		const mockedPageTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, mockedTaxonomy, 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', mockedPageTags),
		);

		const expectedTaxonomyTags = {
			age: [],
			bundles: [],
			gnre: ['p_test1', 'p_drama', 'p_comedy', 'p_horror'],
			media: [],
			pform: [],
			pub: [],
			sex: [],
			theme: ['p_test2', 'p_superheroes'],
			tv: [],
		};

		const expectedResult = { ...mockedCommonParams, ...expectedTaxonomyTags };

		const combinedStrategy = createSelectedStrategy(
			TargetingStrategy.COMBINED,
			mockedContext,
			mockedSkin,
		);

		expect(combinedStrategy.get()).to.deep.eq(expectedResult);
	});

	it('sets up targeting correctly when site tags and page tags are not empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test3', 'superheroes'],
		};
		const mockedPageTags = {
			gnre: ['test2', 'drama', 'comedy', 'horror'],
			theme: ['test4', 'superheroes'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, mockedTaxonomy, 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', mockedPageTags),
		);

		const expectedTaxonomyTags = {
			age: [],
			bundles: [],
			gnre: ['test1', 'drama', 'comedy', 'horror', 'p_test2', 'p_drama', 'p_comedy', 'p_horror'],
			media: [],
			pform: [],
			pub: [],
			sex: [],
			theme: ['test3', 'superheroes', 'p_test4', 'p_superheroes'],
			tv: [],
		};

		const expectedResult = { ...mockedCommonParams, ...expectedTaxonomyTags };

		const combinedStrategy = createSelectedStrategy(
			TargetingStrategy.COMBINED,
			mockedContext,
			mockedSkin,
		);

		expect(combinedStrategy.get()).to.deep.eq(expectedResult);
	});
});
