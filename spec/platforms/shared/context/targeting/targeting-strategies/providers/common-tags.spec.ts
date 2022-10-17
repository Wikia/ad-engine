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
		context.set('wiki', {
			opts: {},
			targeting: {},
		});
	});

	afterEach(() => {
		context.set('geo.country', undefined);
	});

	it('commonTags are returned correctly', function () {
		const mockedSkin = 'test';
		const mockedContext: FandomContext = new FandomContext(
			new Site([], true, 'ec', 'test', false, {}, ['life', 'lifestyle'], 'life'),
			new Page(666, 'pl', 666, 'test', 'article-test', {}),
		);

		const commonTags = new CommonTags(mockedSkin, mockedContext);

		expect(commonTags.getCommonParams()).to.deep.eq({
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
			skin: mockedSkin,
			uap: 'none',
			uap_c: 'none',
			wpage: 'test',
		});
	});
});
