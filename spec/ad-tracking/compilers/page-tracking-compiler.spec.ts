import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { pageTrackingCompiler } from '@wikia/ad-tracking/compilers';

describe('pageTrackingCompiler', () => {
	const sandbox = createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it('adds word count from parser output to tracking params when there is no parser output', () => {
		const mockInputData = { data: {} };
		const expectedOutput = { slot: undefined, data: { word_count: 0 } };

		expect(pageTrackingCompiler(mockInputData)).to.deep.equal(expectedOutput);
	});

	it('adds word count from parser output to tracking params when parser output is a simple text', () => {
		const mockInputData = { data: {} };
		const expectedOutput = { slot: undefined, data: { word_count: 3 } };
		const mockedInnerHtml = 'one two three';

		sandbox.stub(document, 'querySelector').returns({ innerHTML: mockedInnerHtml } as Element);

		expect(pageTrackingCompiler(mockInputData)).to.deep.equal(expectedOutput);
	});

	it('adds word count from parser output to tracking params when parser output includes HTML tags', () => {
		const mockInputData = { data: {} };
		const expectedOutput = { slot: undefined, data: { word_count: 4 } };
		const mockedInnerHtml = '<h2>headline</h2><p>one two <b>three</b></p>';

		sandbox.stub(document, 'querySelector').returns({ innerHTML: mockedInnerHtml } as Element);

		expect(pageTrackingCompiler(mockInputData)).to.deep.equal(expectedOutput);
	});

	it('adds word count from parser output to tracking params when parser output includes HTML tags with new lines', () => {
		const mockInputData = { data: {} };
		const expectedOutput = { slot: undefined, data: { word_count: 4 } };
		const mockedInnerHtml = '<h2>headline</h2>\n\n\n<p>one two <b>three</b></p>';

		sandbox.stub(document, 'querySelector').returns({ innerHTML: mockedInnerHtml } as Element);

		expect(pageTrackingCompiler(mockInputData)).to.deep.equal(expectedOutput);
	});
});
