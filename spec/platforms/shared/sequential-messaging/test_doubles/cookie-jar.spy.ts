import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { CookieJarInterface } from '../../../../../platforms/shared/sequential-messaging/interfaces/cookie-jar-interface';

class CookieJarSpy implements CookieJarInterface {
	set(string, IcSequentialMessaging): void {}
}

export function makeCookieJarSpy(): SinonStubbedInstance<CookieJarSpy> {
	return createStubInstance(CookieJarSpy);
}
