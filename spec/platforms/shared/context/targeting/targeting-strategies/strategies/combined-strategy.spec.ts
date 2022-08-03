import { expect } from 'chai';

import {
	Context,
	Site,
	Page,
} from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/models/context';
import { CombinedStrategy } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/strategies/combined-strategy';

describe('CombinedStrategy execution', () => {
	const mockedSkin = 'test';

	it('Returns empty tags when site and page are empty', function () {
		const mockedContext: Context = new Context(
			new Site([], true, 'ec', 'test', false, {}, 'lifestyle'),
			new Page(666, 'pl', 666, 'test', 'all_ads', {}),
		);
		const expectedTargeting = {
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

		expect(new CombinedStrategy(mockedSkin, mockedContext).execute()).to.deep.eq(expectedTargeting);
	});
});
