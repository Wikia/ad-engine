import { TagsByKeyComposer } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/tags-by-key-composer';
import { expect } from 'chai';

describe('Combine Tags Decorator', () => {
	it('tags are combined correctly', () => {
		const combinedDecorator = new TagsByKeyComposer(null);

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

		const combinedTags = combinedDecorator.combineTags(tagsToCombine1, tagsToCombine2);

		expect(combinedTags).to.deep.eq({
			age: ['age1', 'age2', 'age3', 'age4'],
			gnre: ['gnre1', 'gnre2'],
			theme: [],
			tv: ['tv1', 'tv2', 'tv3', 'tv4'],
		});
	});

	it('combining tags to empty array works', () => {
		const combinedDecorator = new TagsByKeyComposer(null);

		const tagsToCombine1 = {};

		const tagsToCombine2 = {
			age: ['age3', 'age4'],
			gnre: ['gnre2'],
			theme: [],
			tv: ['tv3', 'tv4'],
		};

		const combinedTags = combinedDecorator.combineTags(tagsToCombine1, tagsToCombine2);

		expect(combinedTags).to.deep.eq(tagsToCombine2);
	});

	it('combined tags are not doubled', () => {
		const combinedDecorator = new TagsByKeyComposer(null);

		const tagsToCombine1 = {
			age: ['age1', 'age2'],
			gnre: ['gnre1'],
			tv: ['tv1', 'tv2'],
		};

		const combinedTags = combinedDecorator.combineTags(tagsToCombine1, tagsToCombine1);

		expect(combinedTags).to.deep.eq(tagsToCombine1);
	});
});
