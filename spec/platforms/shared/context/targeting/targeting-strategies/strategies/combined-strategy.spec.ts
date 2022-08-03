import { expect } from 'chai';

import {
	Context,
	Site,
	Page,
} from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/models/context';
import { CombinedStrategy } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/strategies/combined-strategy';

describe('CombinedStrategy execution', () => {
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
		s1: '_wikia',
		s2: 'article',
		sex: [],
		skin: 'test',
		theme: [],
		tv: [],
		uap: 'none',
		uap_c: 'none',
		wpage: 'test',
	};

	it('Returns empty tags when site and page are empty', function () {
		const mockedContext: Context = new Context(
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
		const mockedContext: Context = new Context(
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
		const mockedContext: Context = new Context(
			new Site([], true, 'ec', 'test', false, {}, 'lifestyle'),
			new Page(666, 'pl', 666, 'test', 'all_ads', mockedPageTags),
		);
		const expectedTargeting = { ...defaultExpectedTargeting, ...mockedPageTags };

		expect(new CombinedStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(expectedTargeting);
	});
});
