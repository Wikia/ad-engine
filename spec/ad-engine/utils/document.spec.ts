import { getDocumentVisibilityStatus, VISIBILITY_STATUS } from '@wikia/ad-engine/utils';
import { expect } from 'chai';

describe('document utils', () => {
	let hidden;

	before(() => {
		Object.defineProperty(document, 'hidden', { get: () => hidden });
	});

	it('include document_hidden=1 if document is hidden', () => {
		hidden = false;
		expect(getDocumentVisibilityStatus()).to.equal(VISIBILITY_STATUS.visible);
	});

	it('include document_hidden=0 if document is not hidden', () => {
		hidden = true;

		expect(getDocumentVisibilityStatus()).to.equal(VISIBILITY_STATUS.hidden);
	});

	it('include document_hidden=-1 if document.hidden is undefined', () => {
		hidden = undefined;

		expect(getDocumentVisibilityStatus()).to.equal(VISIBILITY_STATUS.notImplemented);
	});
});
