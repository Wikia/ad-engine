import { expect } from 'chai';
import { context } from '@wikia/core';
import {
	FandomContext,
	Site,
	Page,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { CommonTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/common-tags';
import { TagsPlainSumBuilder } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/tags-plain-sum-builder';
import { TagsByKeyComposer } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/tags-by-key-composer';
import { SiteLevelTaxonomyTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/site-level-taxonomy-tags';
import { PrefixDecorator } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/prefix-decorator';
import { PageLevelTaxonomyTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/page-level-taxonomy-tags';

describe('CombinedStrategySiteTagsBased execution', () => {
	beforeEach(() => {
		context.set('geo.country', 'PL');
	});

	afterEach(() => {
		context.set('geo.country', undefined);
	});

	const mockedSkin = 'test';
	const defaultExpectedTargeting = {
		age: [],
		ar: '4:3',
		artid: '666',
		bundles: [],
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
		s0: 'life',
		s0c: [],
		s0v: 'lifestyle',
		s1: '_test',
		s2: 'article-test',
		sex: [],
		skin: mockedSkin,
		theme: [],
		tv: [],
		uap: 'none',
		uap_c: 'none',
		wpage: 'test',
	};

	it('Returns empty tags when site and page tags are empty', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, ['life', 'lifestyle'], 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		const combinedStrategy = new TagsPlainSumBuilder([
			new CommonTags(mockedSkin, mockedContext),
			new TagsByKeyComposer([
				new SiteLevelTaxonomyTags(mockedContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
			]),
		]);

		expect(combinedStrategy.get()).to.deep.eq(defaultExpectedTargeting);
	});

	it('Returns tags when site tags are not empty and page tags are empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, ['life', 'lifestyle'], 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);
		const expectedTargeting = { ...defaultExpectedTargeting, ...mockedSiteTags };

		const combinedStrategy = new TagsPlainSumBuilder([
			new CommonTags(mockedSkin, mockedContext),
			new TagsByKeyComposer([
				new SiteLevelTaxonomyTags(mockedContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
			]),
		]);

		expect(combinedStrategy.get()).to.deep.eq(expectedTargeting);
	});

	it('Returns tags when site tags are empty and page tags are not empty', function () {
		const mockedPageTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, ['life', 'lifestyle'], 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', mockedPageTags),
		);
		const expectedTargeting = {
			...defaultExpectedTargeting,
			...{ gnre: ['p_test1', 'p_drama', 'p_comedy', 'p_horror'] },
			...{ theme: ['p_test2', 'p_superheroes'] },
		};

		const combinedStrategy = new TagsPlainSumBuilder([
			new CommonTags(mockedSkin, mockedContext),
			new TagsByKeyComposer([
				new SiteLevelTaxonomyTags(mockedContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
			]),
		]);

		expect(combinedStrategy.get()).to.deep.eq(expectedTargeting);
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
			new Site([], true, 'ec', 'test', false, mockedSiteTags, ['life', 'lifestyle'], 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', mockedPageTags),
		);
		const expectedTargeting = {
			...defaultExpectedTargeting,
			...{
				gnre: ['test1', 'drama', 'comedy', 'horror', 'p_test2', 'p_drama', 'p_comedy', 'p_horror'],
			},
			...{ theme: ['test3', 'superheroes', 'p_test4', 'p_superheroes'] },
		};

		const combinedStrategy = new TagsPlainSumBuilder([
			new CommonTags(mockedSkin, mockedContext),
			new TagsByKeyComposer([
				new SiteLevelTaxonomyTags(mockedContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
			]),
		]);

		expect(combinedStrategy.get()).to.deep.eq(expectedTargeting);
	});
});
