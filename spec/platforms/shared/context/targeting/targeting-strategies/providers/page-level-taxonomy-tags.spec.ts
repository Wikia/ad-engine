import { expect } from 'chai';
import {
	FandomContext,
	Site,
	Page,
} from '@wikia/platforms/shared/context/targeting/targeting-strategies/models/fandom-context';
import { PageLevelTaxonomyTags } from '@wikia/platforms/shared/context/targeting/targeting-strategies/providers/page-level-taxonomy-tags';

describe('PageLevelTaxonomyTags execution', () => {
	it('Page Level Tags are extracted correctly from fandomContext object', function () {
		const mockedPageTags = {
			age: ['age'],
			gnre: ['gnre1', 'gnre2'],
			pub: [],
			tv: ['tv1', 'tv2'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site(null, null, null, null, null, null, null, null),
			new Page(null, null, null, null, null, mockedPageTags),
		);

		const pageLevelTags = new PageLevelTaxonomyTags(mockedContext);

		expect(pageLevelTags.get()).to.deep.eq({
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

	it('When there are no page level tags - taxonomy tags are created with empty arrays as values', function () {
		const mockedContext: FandomContext = new FandomContext(
			new Site(null, null, null, null, null, null, null, null),
			new Page(null, null, null, null, null, {}),
		);

		const pageLevelTags = new PageLevelTaxonomyTags(mockedContext);

		expect(pageLevelTags.get()).to.deep.eq({
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
