import { FetchTimeout } from '@wikia/core/utils';
import { expect } from 'chai';
import sinon from 'sinon';

describe('fetch-timeout', () => {
	const globalThisContext: any = globalThis;
	const globalOriginalFetch: any = globalThisContext.fetch;

	afterEach('restore original fetch', () => {
		globalThisContext.fetch = globalOriginalFetch;
	});

	it('call "fetch" on normal usage', () => {
		globalThisContext.fetch = sinon.stub();

		const fetchTimeout = new FetchTimeout();
		fetchTimeout.fetch('http://non-exisitng.fandom-domain.com/i-like-cookies', 10);

		expect(globalThisContext.fetch.callCount).to.be.eq(1);
	});
});
