import { expect } from 'chai';
import { assert } from 'sinon';
import { SequenceHandler } from '../../../../platforms/shared/sequential-messaging/sequence-handler';
import { makeCookieJarSpy } from './test_doubles/cookie-jar.spy';
import { makeInstantConfigServiceSpy } from './test_doubles/instant-config-service.spy';

describe('Sequence Handler', () => {
	it('Handle a proper Sequence', () => {
		const cookieJar = makeCookieJarSpy();
		const instantConfig = makeInstantConfigServiceSpy();
		instantConfig.get.returns({
			1234567890: {
				length: 4,
			},
		});

		const sh = new SequenceHandler(instantConfig, cookieJar);
		sh.handleItem('1234567890');
		sh.handleItem('111');

		expect(sh).to.be.instanceOf(SequenceHandler);
		assert.calledOnce(cookieJar.set);
		assert.calledWith(cookieJar.set, 'sequential_messaging', {
			1234567890: {
				length: 4,
			},
		});
	});

	it('Handle no line items configured', () => {
		const cookieJar = makeCookieJarSpy();
		const icbm = makeInstantConfigServiceSpy();
		icbm.get.returns(undefined);

		const sh = new SequenceHandler(icbm, cookieJar);

		sh.handleItem('1234567890');

		expect(sh).to.be.instanceOf(SequenceHandler);
		assert.notCalled(cookieJar.set);
	});
});
