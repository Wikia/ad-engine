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
			tv: ['tv1', 'tv2'],
		};

		const mockedContext: FandomContext = new FandomContext(
			new Site(null, null, null, null, null, null, null, null, null),
			new Page(null, null, null, null, null, mockedPageTags),
		);

		const pageLevelTags = new PageLevelTaxonomyTags(mockedContext);

		expect(pageLevelTags.get()).to.deep.eq({
			age: ['age'],
			gnre: ['gnre1', 'gnre2'],
			tv: ['tv1', 'tv2'],
		});
	});
});
