import { TagsPlainSumBuilder } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/tags-plain-sum-builder';
import { expect } from 'chai';

function tagProvider(obj) {
	return {
		get() {
			return obj;
		},
	};
}

describe('Tags Plain Sum Builder', () => {
	it('Two set of tags are combined correctly', () => {
		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
			s1: null,
		};

		const tagsToCombine2 = {
			media: ['media1', 'media2'],
			pform: ['pform1'],
			pub: ['pub1'],
			s1: [],
		};

		const combinedTags = new TagsPlainSumBuilder([
			tagProvider(tagsToCombine1),
			tagProvider(tagsToCombine2),
		]).get();

		expect(combinedTags).to.deep.eq({
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
			media: ['media1', 'media2'],
			pform: ['pform1'],
			pub: ['pub1'],
			s1: [],
		});
		expect(tagsToCombine1).to.deep.eq({
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
			s1: null,
		});
		expect(tagsToCombine2).to.deep.eq({
			media: ['media1', 'media2'],
			pform: ['pform1'],
			pub: ['pub1'],
			s1: [],
		});
	});
	it('Three set of tags are combined correctly', () => {
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

		const combinedTags = new TagsPlainSumBuilder([
			tagProvider(tagsToCombine1),
			tagProvider(tagsToCombine2),
			tagProvider(tagsToCombine3),
		]).get();

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

	it('Null tags do not break the code', () => {
		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
			s1: null,
		};

		const tagsToCombine2 = null;
		const tagsToCombine3 = null;

		const combinedTags = new TagsPlainSumBuilder([
			tagProvider(tagsToCombine1),
			tagProvider(tagsToCombine2),
			tagProvider(tagsToCombine3),
		]).get();

		expect(combinedTags).to.deep.eq(tagsToCombine1);
		expect(tagsToCombine1).to.deep.eq({
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
			s1: null,
		});
		expect(tagsToCombine2).to.deep.eq(null);
		expect(tagsToCombine3).to.deep.eq(null);
	});
});
