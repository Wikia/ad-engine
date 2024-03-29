import { PrefixDecorator } from '@wikia/platforms/shared/context/targeting/targeting-strategies/structures/prefix-decorator';
import { expect } from 'chai';

function tagProvider(obj) {
	return {
		get() {
			return obj;
		},
	};
}

describe('Prefix Tags Decorator', () => {
	it('page prefixes are added correctly to tag values', () => {
		const valuesToAddPrefix = {
			gnre: ['gnre1', 'gnre2', 'gnre3'],
			media: ['media'],
			theme: ['theme1', 'theme2'],
			tv: ['tv1', 'tv2'],
		};

		const prefixedTags = new PrefixDecorator(tagProvider(valuesToAddPrefix)).get();

		expect(prefixedTags).to.deep.eq({
			gnre: ['p_gnre1', 'p_gnre2', 'p_gnre3'],
			media: ['p_media'],
			theme: ['p_theme1', 'p_theme2'],
			tv: ['p_tv1', 'p_tv2'],
		});
	});

	it("page prefixes are not added to tags that are not in 'tagsToAddPrefix' list", () => {
		const valuesToAddPrefix = {
			age: ['age1', 'age2'],
			bundles: ['bundle1', 'bundle2'],
			media: ['media'],
			theme: ['theme1', 'theme2'],
			tv: ['tv1', 'tv2'],
		};

		const prefixedTags = new PrefixDecorator(tagProvider(valuesToAddPrefix)).get();

		expect(prefixedTags).to.deep.eq({
			age: ['age1', 'age2'],
			bundles: ['bundle1', 'bundle2'],
			media: ['p_media'],
			theme: ['p_theme1', 'p_theme2'],
			tv: ['p_tv1', 'p_tv2'],
		});
	});

	it('does not break if tags are null', () => {
		const valuesToAddPrefix = null;

		const prefixedTags = new PrefixDecorator(tagProvider(valuesToAddPrefix)).get();

		expect(prefixedTags).to.deep.eq(null);
	});
});
