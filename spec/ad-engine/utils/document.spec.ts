import { pageInIframe } from '@wikia/ad-engine/utils';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('document utils', () => {
	let hidden;
	const sandbox = sinon.createSandbox();

	before(() => {
		sandbox.stub(document, 'hidden').get(() => hidden);
	});

	after(() => {
		sandbox.restore();
	});

	describe('pageInIframe', () => {
		beforeEach(() => {
			sandbox.stub(window, 'self').value('same_object');
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('returns true if page is loaded inside an iframe', () => {
			sandbox.stub(window, 'top').value('different_object');
			expect(pageInIframe()).to.equal(true);
		});

		it('returns false if page is not loaded inside an iframe', () => {
			sandbox.stub(window, 'top').value('same_object');
			expect(pageInIframe()).to.equal(false);
		});
	});
});
