import Cookies from 'js-cookie';
import sinon from 'sinon';
import { UserSequentialMessageStateStore } from '../../../../../platforms/shared/sequential-messaging/infrastructure/user-sequential-message-state-store';

describe('User Sequential Message State Store', () => {
	it("Store user's sequential message state in a cookie", () => {
		const cookieSpy = sinon.spy(Cookies, 'set');
		const store = new UserSequentialMessageStateStore(Cookies);
		const sampleState = {
			5854346762: {
				length: 4,
				targeting: { cid: 'sequential_messaging' },
			},
		};

		store.set(sampleState);

		sinon.assert.calledWith(cookieSpy, store.cookieName, sampleState);
	});

	it("Retrieve user's sequential message state from a cookie", () => {
		const cookieSpy = sinon.spy(Cookies, 'get');
		const store = new UserSequentialMessageStateStore(Cookies);

		store.get();

		sinon.assert.calledWith(cookieSpy, store.cookieName);
	});
});
