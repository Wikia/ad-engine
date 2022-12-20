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
			word_count: 546,
			wpage: 'test',
		});
	});

	it('should map empty taxonomy tags', function () {
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
				[],
			),
			new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext).getCommonParams();

		expect(commonTags.s0).to.be.undefined;
		expect(commonTags.s0v).to.be.undefined;
	});

	it('should create rating tag', function () {
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
				[],
			),
			new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext);

		expect(commonTags.getCommonParams().rating).to.be.eq('esrb:ec,mpa:general');
	});

	it('should create rating tag with more than 1 ESRB value', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site(
				[],
				true,
				'test',
				false,
				{
					mpa: ['general'],
					esrb: ['ec', 'mature'],
				},
				[],
			),
			new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext);

		expect(commonTags.getCommonParams().rating).to.be.eq('esrb:ec,esrb:mature,mpa:general');
	});

	it('should create rating tag with more than 1 MPA value', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site(
				[],
				true,
				'test',
				false,
				{
					mpa: ['general', 'pg'],
					esrb: ['ec'],
				},
				[],
			),
			new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext);

		expect(commonTags.getCommonParams().rating).to.be.eq('esrb:ec,mpa:general,mpa:pg');
	});

	it('should create rating tag with no rating value', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'test', false, {}, []),
			new Page(666, 'pl', 666, 'test', 'article-test', {}, 546),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext);

		expect(commonTags.getCommonParams().rating).to.be.undefined;
	});
});
