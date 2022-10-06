import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { context } from '../../../../src';
import { PlatformContextSetup } from '../../../../src/platforms/shared/setup/platform-context.setup';

describe('PlatformContextSetup', () => {
	const sandbox = createSandbox();
	const platformContextSetup = new PlatformContextSetup();

	beforeEach(() => {
		context.set('wiki', { _s1: 'test' });
	});

	afterEach(() => {
		sandbox.restore();

		context.remove('wiki');
	});

	it('adds word count from parser output to wiki context data when there is no parser output', () => {
		platformContextSetup.execute();

		expect(context.get('wiki.wordCount')).to.equal(0);
	});

	it('adds word count from parser output to wiki context data when parser output is a simple text', () => {
		const mockedInnerText = 'one two three';

		sandbox.stub(document, 'querySelector').returns({ innerText: mockedInnerText } as HTMLElement);
		platformContextSetup.execute();

		expect(context.get('wiki.wordCount')).to.equal(3);
	});

	it('adds word count from parser output to wiki context data when parser output includes new lines', () => {
		const mockedInnerText = 'headline\n\none two three';

		sandbox.stub(document, 'querySelector').returns({ innerText: mockedInnerText } as HTMLElement);
		platformContextSetup.execute();

		expect(context.get('wiki.wordCount')).to.equal(4);
	});
});
