import { pageInIframe } from '@wikia/core/utils';
import { expect } from 'chai';

describe('document utils', () => {
	let hidden;

	before(() => {
		global.sandbox.stub(document, 'hidden').get(() => hidden);
	});

	describe('pageInIframe', () => {
		beforeEach(() => {
			global.sandbox.stub(window, 'self').value('same_object');
		});

		afterEach(() => {
			global.sandbox.restore();
		});

		it('returns true if page is loaded inside an iframe', () => {
			global.sandbox.stub(window, 'top').value('different_object');
			expect(pageInIframe()).to.equal(true);
		});

		it('returns false if page is not loaded inside an iframe', () => {
			global.sandbox.stub(window, 'top').value('same_object');
			expect(pageInIframe()).to.equal(false);
		});
	});
});
