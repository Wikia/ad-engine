import { expect } from 'chai';
import {
	FandomContext,
	Site,
	Page,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { SiteLevelTaxonomyTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/site-level-taxonomy-tags';

describe('SiteLevelTaxonomyTags execution', () => {
	it('Site Level Tags are extracted correctly from fandomContext object', function () {
		const mockedSiteTags = {
			age: ['age'],
			gnre: ['gnre1', 'gnre2'],
			tv: ['tv1', 'tv2'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site(null, null, null, null, mockedSiteTags, null),
			new Page(null, null, null, null, null, null, 546),
		);

		const siteLevelTags = new SiteLevelTaxonomyTags(mockedContext);

		expect(siteLevelTags.get()).to.deep.eq({
			age: ['age'],
			gnre: ['gnre1', 'gnre2'],
			tv: ['tv1', 'tv2'],
		});
	});
});
