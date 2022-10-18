import { expect } from 'chai';

import { context } from '@wikia/core';
import {
	FandomContext,
	Site,
	Page,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { TagsPlainSumBuilder } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/tags-plain-sum-builder';
import { CommonTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/common-tags';
import { TagsByKeyComposer } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/tags-by-key-composer';
import { SiteLevelTaxonomyTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/site-level-taxonomy-tags';
import { PrefixDecorator } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/prefix-decorator';
import { PageLevelTaxonomyTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/page-level-taxonomy-tags';

describe('CombinedStrategy', () => {
	beforeEach(() => {
		context.set('geo.country', 'PL');
		context.set('wiki.targeting.wikiVertical', 'test');
	});

	afterEach(() => {
		context.set('geo.country', undefined);
		context.set('wiki.targeting.wikiVertical', undefined);
	});

	const mockedSkin = 'test';
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
		s0: 'life',
		s0c: [],
		s0v: 'lifestyle',
		s1: '_test',
		s2: 'article-test',
		skin: 'test',
		uap: 'none',
		uap_c: 'none',
		wpage: 'test',
	};

	it('sets up targeting correctly when taxonomy tags are empty', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, ['life', 'lifestyle'], 'life'),
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

		const combinedStrategy = new TagsPlainSumBuilder([
			new CommonTags(mockedSkin, mockedContext),
			new TagsByKeyComposer([
				new SiteLevelTaxonomyTags(mockedContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
			]),
		]);

		expect(combinedStrategy.get()).to.deep.eq({ ...mockedCommonParams, ...expectedTaxonomyTags });
	});

	it('sets up targeting correctly when site tags are not empty and page tags are empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
			tv: ['test1', 'movie'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, ['life', 'lifestyle'], 'life'),
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

		const combinedStrategy = new TagsPlainSumBuilder([
			new CommonTags(mockedSkin, mockedContext),
			new TagsByKeyComposer([
				new SiteLevelTaxonomyTags(mockedContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
			]),
		]);

		expect(combinedStrategy.get()).to.deep.eq({ ...mockedCommonParams, ...expectedTaxonomyTags });
	});

	it('sets up targeting correctly when site tags are empty and page tags are not empty', function () {
		const mockedPageTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, ['life', 'lifestyle'], 'life'),
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

		const combinedStrategy = new TagsPlainSumBuilder([
			new CommonTags(mockedSkin, mockedContext),
			new TagsByKeyComposer([
				new SiteLevelTaxonomyTags(mockedContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
			]),
		]);

		expect(combinedStrategy.get()).to.deep.eq({ ...mockedCommonParams, ...expectedTaxonomyTags });
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
			new Site([], true, 'ec', 'test', false, mockedSiteTags, ['life', 'lifestyle'], 'life'),
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

		const combinedStrategy = new TagsPlainSumBuilder([
			new CommonTags(mockedSkin, mockedContext),
			new TagsByKeyComposer([
				new SiteLevelTaxonomyTags(mockedContext),
				new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
			]),
		]);

		expect(combinedStrategy.get()).to.deep.eq({ ...mockedCommonParams, ...expectedTaxonomyTags });
	});
});
