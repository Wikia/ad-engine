import { mapTaxonomyToLotameBehaviorTags } from '@wikia/ad-services';
import { expect } from 'chai';

describe('Lotame', () => {
	it('should map taxonomy to lotame behavior tags', () => {
		const result = mapTaxonomyToLotameBehaviorTags({
			age: ['18-24', '25-34'],
			tv: ['history'],
			bundles: ['bund1', 'bund2'],
		});

		expect(result).to.deep.equal(['age: 18-24', 'age: 25-34', 'tv: history']);
	});

	it('shold return empty array when taxonomy is empty', () => {
		const result = mapTaxonomyToLotameBehaviorTags({});

		expect(result).to.deep.equal([]);
	});
});
