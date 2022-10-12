import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { getContentWordCount } from '@wikia/core/utils';

describe('getContentWordCount()', () => {
	const sandbox = createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it('returns 0 when there is nothing', () => {
		expect(getContentWordCount('.test-article-content')).to.equal(0);
	});

	it('returns 0 when there is no text', () => {
		const mockedInnerText = '';

		sandbox.stub(document, 'querySelector').returns({ innerText: mockedInnerText } as HTMLElement);
		expect(getContentWordCount('.test-article-content')).to.equal(0);
	});

	it('returns proper count for simple text', () => {
		const mockedInnerText = 'one two three';

		sandbox.stub(document, 'querySelector').returns({ innerText: mockedInnerText } as HTMLElement);
		expect(getContentWordCount('.test-article-content')).to.equal(3);
	});

	it('returns proper count for text that includes new lines', () => {
		const mockedInnerText = 'headline\n\none two three';

		sandbox.stub(document, 'querySelector').returns({ innerText: mockedInnerText } as HTMLElement);
		expect(getContentWordCount('.test-article-content')).to.equal(4);
	});
});
