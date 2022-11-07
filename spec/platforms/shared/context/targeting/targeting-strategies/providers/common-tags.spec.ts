import { expect } from 'chai';
import { context } from '@wikia/core';
import {
	FandomContext,
	Site,
	Page,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { CommonTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/common-tags';

describe('CommonTags', () => {
	beforeEach(() => {
		context.set('geo.country', 'PL');
	});

	afterEach(() => {
		context.set('geo.country', undefined);
	});

	const mockedSkin = 'test';
	const mockedTaxonomy = ['life', 'lifestyle'];

	it('commonTags are returned correctly', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, mockedTaxonomy, null, 'general'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext);

		expect(commonTags.getCommonParams()).to.deep.eq({
			ar: '4:3',
			artid: '666',
			dmn: '',
			rating: 'esrb:ec,mpa:general',
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
			skin: mockedSkin,
			uap: 'none',
			uap_c: 'none',
			wpage: 'test',
		});
	});

	it('should map empty s0v', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, [], 'VERTICAL', 'general'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext).getCommonParams();

		expect(commonTags.s0).to.eq('VERTICAL');
		expect(commonTags.s0v).to.be.undefined;
	});

	it('should map empty taxonomy tags', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, [], undefined, 'general'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext).getCommonParams();

		expect(commonTags.s0).to.be.null;
		expect(commonTags.s0v).to.be.undefined;
	});
});
