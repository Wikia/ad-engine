import Cookies from 'js-cookie';
import sinon from 'sinon';
import { UserSequentialMessageStateStore } from '../../../../../platforms/shared/sequential-messaging/infrastructure/user-sequential-message-state-store';

const sampleState = { 5928558921: { stepNo: 1, width: 970, height: 250 } };

describe('User Sequential Message State Store', () => {
	it("Store user's sequential message state in a cookie", () => {
		const cookieSpy = sinon.spy(Cookies, 'set');

		const store = new UserSequentialMessageStateStore(Cookies);
		store.set(sampleState);

		sinon.assert.calledWith(
			cookieSpy,
			UserSequentialMessageStateStore.cookieName,
			JSON.stringify(sampleState),
		);
	});

	it("Retrieve user's sequential message state from a cookie", () => {
		const cookieMock = sinon.mock(Cookies);
		cookieMock
			.expects('get')
			.withArgs(UserSequentialMessageStateStore.cookieName)
			.returns(JSON.stringify(sampleState));

		const store = new UserSequentialMessageStateStore(Cookies);
		store.get();

		cookieMock.verify();
	});

	it('Attempt to retrieve not existing cookie', () => {
		const cookieMock = sinon.mock(Cookies);
		cookieMock
			.expects('get')
			.withArgs(UserSequentialMessageStateStore.cookieName)
			.returns(null);

		const store = new UserSequentialMessageStateStore(Cookies);
		store.get();

		cookieMock.verify();
	});

	it("Delete user's sequential message cookie", () => {
		const cookieSpy = sinon.spy(Cookies, 'remove');

		const store = new UserSequentialMessageStateStore(Cookies);
		store.delete();

		sinon.assert.calledWith(cookieSpy, UserSequentialMessageStateStore.cookieName, {
			domain: UserSequentialMessageStateStore.cookieDomain,
		});
	});
});
