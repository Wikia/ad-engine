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
			pub: [],
			tv: ['tv1', 'tv2'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site(null, null, null, null, null, mockedSiteTags, null, null),
			new Page(null, null, null, null, null, null),
		);

		const siteLevelTags = new SiteLevelTaxonomyTags(mockedContext);

		expect(siteLevelTags.get()).to.deep.eq({
			age: ['age'],
			bundles: [],
			gnre: ['gnre1', 'gnre2'],
			media: [],
			pform: [],
			pub: [],
			sex: [],
			theme: [],
			tv: ['tv1', 'tv2'],
		});
	});

	it('When there are no site level tags - taxonomy tags are created with empty arrays as values', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site(null, null, null, null, null, {}, null, null),
			new Page(null, null, null, null, null, null),
		);

		const siteLevelTags = new SiteLevelTaxonomyTags(mockedContext);

		expect(siteLevelTags.get()).to.deep.eq({
			age: [],
			bundles: [],
			gnre: [],
			media: [],
			pform: [],
			pub: [],
			sex: [],
			theme: [],
			tv: [],
		});
	});
});
