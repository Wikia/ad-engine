import { InstantConfigServiceInterface } from '@wikia/ad-services';
import { InstantConfigValue } from '@wikia/ad-services/instant-config/instant-config.models';
import { expect } from 'chai';
import { assert, createStubInstance, SinonStubbedInstance } from 'sinon';
import {
	CookieJar,
	SequenceHandler,
} from '../../../../../platforms/shared/sequential-messaging/sequence-handler';

class InstantConfigServiceSpy implements InstantConfigServiceInterface {
	get<T extends InstantConfigValue>(key: string, defaultValue?: T): T {
		return undefined;
	}
}

class CookieJarSpy implements CookieJar {
	set(string, IcSequentialMessaging): void {}
}

export function makeInstantConfigServiceSpy(): SinonStubbedInstance<InstantConfigServiceSpy> {
	return createStubInstance(InstantConfigServiceSpy);
}

export function makeCookieJarSpy(): SinonStubbedInstance<CookieJarSpy> {
	return createStubInstance(CookieJarSpy);
}

describe('Sequence Handler', () => {
	it('Handle a proper Sequence', () => {
		const cookieJar = makeCookieJarSpy();
		const icbm = makeInstantConfigServiceSpy();
		icbm.get.returns({
			1234567890: {
				length: 4,
			},
		});

		const sh = new SequenceHandler(icbm, cookieJar);
		sh.handleItem('1234567890');

		expect(sh).to.be.instanceOf(SequenceHandler);
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
