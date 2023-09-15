import { mapTaxonomyToLotameBehaviorTags, removeIrrelevantTags } from '@wikia/ad-services';
import { expect } from 'chai';

describe('Lotame', () => {
	it('should map taxonomy to lotame behavior tags', () => {
		const result = mapTaxonomyToLotameBehaviorTags({
			tv: ['history', 'comedy'],
			bundles: ['bund1', 'bund2'],
			pform: ['desktop'],
		});

		expect(result).to.deep.equal(['pform: desktop', 'tv: history', 'tv: comedy']);
	});

	it('should return empty array when taxonomy is empty', () => {
		const result = mapTaxonomyToLotameBehaviorTags({});

		expect(result).to.deep.equal([]);
	});

	it('should skip irrelevant tags', () => {
		const result = removeIrrelevantTags({
			tv: ['history', 'comedy'],
			bundles: ['bund1', 'bund2'],
			age: ['18-24', '25-34'],
		});

		expect(result).to.deep.equal({
			tv: ['history', 'comedy'],
		});
	});
});
