import { TagsByKeyComposer } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/tags-by-key-composer';
import { expect } from 'chai';

function tagProvider(obj) {
	return {
		get() {
			return obj;
		},
	};
}

describe('Tags By Key Composer', () => {
	it('tags are combined correctly', () => {
		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
		};

		const tagsToCombine2 = {
			age: ['age3', 'age4'],
			gnre: ['gnre2'],
			theme: [],
			tv: ['tv3', 'tv4'],
		};

		const combinedTags = new TagsByKeyComposer([
			tagProvider(tagsToCombine1),
			tagProvider(tagsToCombine2),
		]).get();

		expect(combinedTags).to.deep.eq({
			age: ['age1', 'age2', 'age3', 'age4'],
			gnre: ['gnre1', 'gnre2'],
			theme: [],
			tv: ['tv1', 'tv2', 'tv3', 'tv4'],
		});
		expect(tagsToCombine1).to.deep.eq({
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
		});
		expect(tagsToCombine2).to.deep.eq({
			age: ['age3', 'age4'],
			gnre: ['gnre2'],
			theme: [],
			tv: ['tv3', 'tv4'],
		});
	});

	it('combining tags to empty array works', () => {
		const tagsToCombine1 = {};

		const tagsToCombine2 = {
			age: ['age3', 'age4'],
			gnre: ['gnre2'],
			theme: [],
			tv: ['tv3', 'tv4'],
		};

		const combinedTags = new TagsByKeyComposer([
			tagProvider(tagsToCombine1),
			tagProvider(tagsToCombine2),
		]).get();

		expect(combinedTags).to.deep.eq(tagsToCombine2);
	});

	it('combined tags are not doubled', () => {
		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
		};

		const combinedTags = new TagsByKeyComposer([
			tagProvider(tagsToCombine1),
			tagProvider(tagsToCombine1),
		]).get();

		expect(combinedTags).to.deep.eq(tagsToCombine1);
	});

	it('does not break if tags are null', () => {
		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
		};

		const tagsToCombine2 = null;

		const combinedTags = new TagsByKeyComposer([
			tagProvider(tagsToCombine1),
			tagProvider(tagsToCombine2),
		]).get();

		expect(combinedTags).to.deep.eq(tagsToCombine1);
	});

	it('Rating tags are not combined', () => {
		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
		};

		const tagsToCombine2 = {
			age: ['age3', 'age4'],
			gnre: ['gnre2'],
			esrb: ['esrb'],
			mpa: ['mpa'],
			tv: ['tv3', 'tv4'],
		};

		const combinedTags = new TagsByKeyComposer([
			tagProvider(tagsToCombine1),
			tagProvider(tagsToCombine2),
		]).get();

		expect(combinedTags).to.deep.eq({
			age: ['age1', 'age2', 'age3', 'age4'],
			gnre: ['gnre1', 'gnre2'],
			tv: ['tv1', 'tv2', 'tv3', 'tv4'],
		});
	});
});
