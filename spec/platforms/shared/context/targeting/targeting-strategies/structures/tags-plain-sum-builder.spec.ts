import { TagsPlainSumBuilder } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/tags-plain-sum-builder';
import { expect } from 'chai';

describe.skip('Tags Plain Sum Builder', () => {
	it('Two set of tags are combined correctly', () => {
		const sumBuilder = new TagsPlainSumBuilder(null);

		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
		};

		const tagsToCombine2 = {
			media: ['media1', 'media2'],
			pform: ['pform1'],
			pub: ['pub1'],
			s1: [],
		};

		const combinedTags = sumBuilder.sumTags(tagsToCombine1, tagsToCombine2);

		expect(combinedTags).to.deep.eq({
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
			media: ['media1', 'media2'],
			pform: ['pform1'],
			pub: ['pub1'],
			s1: [],
		});
	});

	it('Three set of tags are combined correctly', () => {
		const sumBuilder = new TagsPlainSumBuilder(null);

		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
		};

		const tagsToCombine2 = {
			media: ['media1', 'media2'],
			pform: ['pform1'],
			pub: ['pub1'],
			s1: [],
		};

		const tagsToCombine3 = {
			sex: ['m', 'f'],
			bundles: ['tier1', 'tier2'],
		};

		let combinedTags = sumBuilder.sumTags(tagsToCombine1, tagsToCombine2);

		combinedTags = sumBuilder.sumTags(combinedTags, tagsToCombine3);

		expect(combinedTags).to.deep.eq({
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
			media: ['media1', 'media2'],
			pform: ['pform1'],
			pub: ['pub1'],
			s1: [],
			sex: ['m', 'f'],
			bundles: ['tier1', 'tier2'],
		});
	});
});
