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
		const mockedInnerText = 'one two three';

		sandbox.stub(document, 'querySelector').returns({ innerText: mockedInnerText } as HTMLElement);

		expect(pageTrackingCompiler(mockInputData)).to.deep.equal(expectedOutput);
	});

	it('adds word count from parser output to tracking params when parser output includes new lines', () => {
		const mockInputData = { data: {} };
		const expectedOutput = { slot: undefined, data: { word_count: 4 } };
		const mockedInnerText = 'headline\n\none two three';

		sandbox.stub(document, 'querySelector').returns({ innerText: mockedInnerText } as HTMLElement);

		expect(pageTrackingCompiler(mockInputData)).to.deep.equal(expectedOutput);
	});
});
