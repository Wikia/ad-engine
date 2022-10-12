import { CombineTagsDecorator } from '@wikia/platforms/shared/context/targeting/targeting-strategies/decorators/combine-tags-decorator';
import { expect } from 'chai';
import { MockedSiteLevelTags } from '../mocks/mocked-site-level-tags';
import { MockedPageLevelTags } from '../mocks/mocked-page-level-tags';
import { MockedTestLevelTags } from '../mocks/mocked-test-level-tags';

describe('Combine Tags Decorator', () => {
	it('Site and Page level tags are combined correctly', () => {
		const combined = new CombineTagsDecorator([
			new MockedSiteLevelTags(),
			new MockedPageLevelTags(),
		]);

		expect(combined.execute()).to.deep.eq({
			age: ['site_age', 'page_age'],
			bundles: ['site_bundles', 'page_bundles'],
			gnre: ['site_gnre', 'page_gnre'],
			media: ['site_media', 'page_media'],
			pform: ['site_pform', 'page_pform'],
			pub: ['site_pub', 'page_pub'],
			sex: ['site_sex', 'page_sex'],
			theme: ['site_theme', 'page_theme'],
			tv: ['site_tv', 'page_tv'],
		});
	});

	it('Site and Page and Test level tags are combined correctly', () => {
		const combined = new CombineTagsDecorator([
			new MockedSiteLevelTags(),
			new MockedPageLevelTags(),
			new MockedTestLevelTags(),
		]);

		expect(combined.execute()).to.deep.eq({
			age: ['site_age', 'page_age', 'test_age'],
			bundles: ['site_bundles', 'page_bundles', 'test_bundles'],
			gnre: ['site_gnre', 'page_gnre', 'test_gnre'],
			media: ['site_media', 'page_media', 'test_media'],
			pform: ['site_pform', 'page_pform', 'test_pform'],
			pub: ['site_pub', 'page_pub', 'test_pub'],
			sex: ['site_sex', 'page_sex', 'test_sex'],
			theme: ['site_theme', 'page_theme', 'test_theme'],
			tv: ['site_tv', 'page_tv', 'test_tv'],
		});
	});

	it('Tags are not doubled', () => {
		const combined = new CombineTagsDecorator([
			new MockedSiteLevelTags(),
			new MockedSiteLevelTags(),
		]);

		expect(combined.execute()).to.deep.eq({
			age: ['site_age'],
			bundles: ['site_bundles'],
			gnre: ['site_gnre'],
			media: ['site_media'],
			pform: ['site_pform'],
			pub: ['site_pub'],
			sex: ['site_sex'],
			theme: ['site_theme'],
			tv: ['site_tv'],
		});
	});
});
