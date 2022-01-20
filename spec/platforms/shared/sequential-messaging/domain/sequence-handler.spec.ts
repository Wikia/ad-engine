import { expect } from 'chai';
import { assert } from 'sinon';
import { SequenceHandler } from '../../../../../platforms/shared/sequential-messaging/domain/sequence-handler';
import { makeCookieJarSpy } from '../test_doubles/cookie-jar.spy';
import { makeInstantConfigServiceSpy } from '../test_doubles/instant-config-service.spy';

describe('Sequence Handler', () => {
	it('Handle a proper Sequence', () => {
		const cookieJar = makeCookieJarSpy();
		const instantConfig = makeInstantConfigServiceSpy();
		instantConfig.get.returns({
			1234567890: {
				length: '4',
			},
		});

		const sh = new SequenceHandler(instantConfig, cookieJar);
		sh.handleItem('1234567890');
		sh.handleItem('111');

		expect(sh).to.be.instanceOf(SequenceHandler);
		assert.calledOnce(cookieJar.set);
		assert.calledWith(cookieJar.set, 'sequential_messaging', {
			1234567890: {
				length: '4',
			},
		});
	});

	it('Handle no line items configured', () => {
		const cookieJar = makeCookieJarSpy();
		const instantConfig = makeInstantConfigServiceSpy();
		instantConfig.get.returns(undefined);

		const sh = new SequenceHandler(instantConfig, cookieJar);

		sh.handleItem('1234567890');

		expect(sh).to.be.instanceOf(SequenceHandler);
		assert.notCalled(cookieJar.set);
	});

	it('Handle invalid config', () => {
		const cookieJar = makeCookieJarSpy();
		const instantConfig_invalidValueType = makeInstantConfigServiceSpy();
		instantConfig_invalidValueType.get.returns([]);
		const instantConfig_emptyObject = makeInstantConfigServiceSpy();
		instantConfig_emptyObject.get.returns({});
		const instantConfig_invalidLineItemValue = makeInstantConfigServiceSpy();
		instantConfig_invalidLineItemValue.get.returns({
			1234567890: 'invalid value',
		});
		const instantConfig_invalidLengthValue = makeInstantConfigServiceSpy();
		instantConfig_invalidLengthValue.get.returns({
			1234567890: {
				length: [4],
			},
		});

		const sh1 = new SequenceHandler(instantConfig_invalidValueType, cookieJar);
		const sh2 = new SequenceHandler(instantConfig_emptyObject, cookieJar);
		const sh3 = new SequenceHandler(instantConfig_invalidLineItemValue, cookieJar);
		const sh4 = new SequenceHandler(instantConfig_invalidLengthValue, cookieJar);

		sh1.handleItem('1234567890');
		sh2.handleItem('1234567890');
		sh3.handleItem('1234567890');
		sh4.handleItem('1234567890');

		assert.notCalled(cookieJar.set);
	});
});
