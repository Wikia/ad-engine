import { expect } from 'chai';
import { context } from '@wikia/core';
import {
	FandomContext,
	Site,
	Page,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { PageLevelTaxonomyTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/strategies/page-level-taxonomy-tags';
import { SummaryDecorator } from '@wikia/platforms/shared/context/targeting/targeting-strategies/decorators/summary-decorator';
import { CommonTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/strategies/common-tags';
import { PrefixDecorator } from '@wikia/platforms/shared/context/targeting/targeting-strategies/decorators/prefix-decorator';

describe('PageLevelTaxonomyTags execution', () => {
	beforeEach(() => {
		context.set('geo.country', 'PL');
		context.set('wiki.targeting.wikiDbName', 'test');
	});

	afterEach(() => {
		context.set('geo.country', undefined);
		context.set('wiki.targeting.wikiDbName', undefined);
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

		const pageStrategy = new SummaryDecorator(
			new CommonTags(mockedSkin, mockedContext),
			new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
		);

		expect(pageStrategy.execute()).to.deep.eq(defaultExpectedTargeting);
	});

	it('Returns empty tags when site tags are not empty and page tags are empty', function () {
		const mockedSiteTags = {
			gnre: ['test1', 'drama', 'comedy', 'horror'],
			theme: ['test2', 'superheroes'],
		};
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, mockedSiteTags, ['life', 'lifestyle'], 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		const pageStrategy = new SummaryDecorator(
			new CommonTags(mockedSkin, mockedContext),
			new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
		);

		expect(pageStrategy.execute()).to.deep.eq(defaultExpectedTargeting);
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

		const pageStrategy = new SummaryDecorator(
			new CommonTags(mockedSkin, mockedContext),
			new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
		);

		expect(pageStrategy.execute()).to.deep.eq(expectedTargeting);
	});

	it('Returns correct tags when site and page tags are not empty', function () {
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
				gnre: ['p_test2', 'p_drama', 'p_comedy', 'p_horror'],
			},
			...{ theme: ['p_test4', 'p_superheroes'] },
		};

		const pageStrategy = new SummaryDecorator(
			new CommonTags(mockedSkin, mockedContext),
			new PrefixDecorator(new PageLevelTaxonomyTags(mockedContext)),
		);

		expect(pageStrategy.execute()).to.deep.eq(expectedTargeting);
	});
});
