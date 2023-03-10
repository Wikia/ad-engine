import { expect } from 'chai';

import { context } from '@wikia/core';
import { createSelectedStrategy } from '@wikia/platforms/shared/context/targeting/targeting-strategies/factories/create-selected-strategy';
import { TargetingStrategy } from '@wikia/platforms/shared/context/targeting/targeting-strategies/interfaces/targeting-strategy';
import {
	FandomContext,
	Page,
	Site,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';

describe('CombinedStrategy', () => {
	const mockedTaxonomy = ['life', 'lifestyle'];
	const mockedCommonParams = {
		ar: '4:3',
		artid: '666',
		dmn: '',
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
		skin: 'ucp_desktop',
		uap: 'none',
		uap_c: 'none',
		word_count: '546',
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
			new Site(
				[],
				true,
				'test',
				false,
				{
					mpa: ['general'],
					esrb: ['ec'],
				},
				mockedTaxonomy,
			),
			new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
		);

		const combinedStrategy = createSelectedStrategy(TargetingStrategy.COMBINED, mockedContext);

		const expectedResult = {
			rating: 'esrb:ec,mpa:general',
			...mockedCommonParams,
		};

		expect(combinedStrategy.get()).to.deep.eq(expectedResult);
		expect(mockedContext).to.deep.eq(
			new FandomContext(
				new Site(
					[],
					true,
					'test',
					false,
					{
						mpa: ['general'],
						esrb: ['ec'],
					},
					mockedTaxonomy,
				),
				new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
			),
		);
	});

	it('sets up targeting correctly when site tags are not empty and page tags are empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
			tv: ['test1', 'movie'],
			mpa: ['general'],
			esrb: ['ec'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'test', false, mockedSiteTags, mockedTaxonomy),
			new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
		);

		const expectedTaxonomyTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
			tv: ['test1', 'movie'],
		};

		const expectedResult = {
			rating: 'esrb:ec,mpa:general',
			...mockedCommonParams,
			...expectedTaxonomyTags,
		};

		const combinedStrategy = createSelectedStrategy(TargetingStrategy.COMBINED, mockedContext);

		expect(combinedStrategy.get()).to.deep.eq(expectedResult);
		expect(mockedContext).to.deep.eq(
			new FandomContext(
				new Site([], true, 'test', false, mockedSiteTags, mockedTaxonomy),
				new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
			),
		);
	});

	it('sets up targeting correctly when site tags are empty and page tags are not empty', function () {
		const mockedPageTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'test', false, {}, mockedTaxonomy),
			new Page(666, 'pl', 666, 'test', 'article-test', mockedPageTags, 546),
		);

		const expectedTaxonomyTags = {
			gnre: ['p_test1', 'p_drama', 'p_comedy', 'p_horror'],
			theme: ['p_test2', 'p_superheroes'],
		};

		const expectedResult = { ...mockedCommonParams, ...expectedTaxonomyTags };

		const combinedStrategy = createSelectedStrategy(TargetingStrategy.COMBINED, mockedContext);

		expect(combinedStrategy.get()).to.deep.eq(expectedResult);
		expect(mockedContext).to.deep.eq(
			new FandomContext(
				new Site([], true, 'test', false, {}, ['life', 'lifestyle']),
				new Page(
					666,
					'pl',
					666,
					'test',
					'article-test',
					{
						gnre: ['test1', 'drama', 'comedy', 'horror'],
						theme: ['test2', 'superheroes'],
					},
					546,
				),
			),
		);
	});

	it('sets up targeting correctly when site tags and page tags are not empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test3', 'superheroes'],
			mpa: ['general'],
			esrb: ['ec'],
		};
		const mockedPageTags = {
			gnre: ['test2', 'drama', 'comedy', 'horror'],
			theme: ['test4', 'superheroes'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'test', false, mockedSiteTags, mockedTaxonomy),
			new Page(666, 'pl', 666, 'test', 'article-test', mockedPageTags, 546),
		);

		const expectedTaxonomyTags = {
			rating: 'esrb:ec,mpa:general',
			gnre: ['test1', 'drama', 'comedy', 'horror', 'p_test2', 'p_drama', 'p_comedy', 'p_horror'],
			theme: ['test3', 'superheroes', 'p_test4', 'p_superheroes'],
		};

		const expectedResult = Object.assign({}, mockedCommonParams, expectedTaxonomyTags);

		const combinedStrategy = createSelectedStrategy(TargetingStrategy.COMBINED, mockedContext);

		expect(combinedStrategy.get()).to.deep.eq(expectedResult);
		expect(mockedContext).to.deep.eq(
			new FandomContext(
				new Site(
					[],
					true,
					'test',
					false,
					{
						gnre: ['test1', 'drama', 'comedy', 'horror'],
						theme: ['test3', 'superheroes'],
						mpa: ['general'],
						esrb: ['ec'],
					},
					['life', 'lifestyle'],
				),
				new Page(
					666,
					'pl',
					666,
					'test',
					'article-test',
					{
						gnre: ['test2', 'drama', 'comedy', 'horror'],
						theme: ['test4', 'superheroes'],
					},
					546,
				),
			),
		);
	});
});
