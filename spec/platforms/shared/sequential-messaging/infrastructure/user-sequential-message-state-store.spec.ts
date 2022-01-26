import Cookies from 'js-cookie';
import sinon from 'sinon';
import { UserSequentialMessageStateStore } from '../../../../../platforms/shared/sequential-messaging/infrastructure/user-sequential-message-state-store';

describe('User Sequential Message State Store', () => {
	it('Store state under a cookie name stored here UserSequentialMessageStateStore.cookieName', () => {
		const cookieSpy = sinon.spy(Cookies, 'set');
		const store = new UserSequentialMessageStateStore(Cookies);
		const sampleState = {
			1234567890: {
				length: 4,
			},
		};

		store.set(sampleState);

		sinon.assert.calledWith(cookieSpy, store.cookieName, sampleState);
	});
});
