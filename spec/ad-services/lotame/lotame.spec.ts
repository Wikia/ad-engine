import { mapTaxonomyToLotameBehaviorTags } from '@wikia/ad-services';
import { expect } from 'chai';

describe('Lotame', () => {
	it('should map taxonomy to lotame behavior tags', () => {
		const result = mapTaxonomyToLotameBehaviorTags({
			tv: ['history', 'comedy'],
			bundles: ['bund1', 'bund2'],
			pform: ['desktop'],
		});

		expect(result).to.deep.equal(['tv: history', 'tv: comedy', 'pform: desktop']);
	});

	it('should return empty array when taxonomy is empty', () => {
		const result = mapTaxonomyToLotameBehaviorTags({});

		expect(result).to.deep.equal([]);
	});
});
