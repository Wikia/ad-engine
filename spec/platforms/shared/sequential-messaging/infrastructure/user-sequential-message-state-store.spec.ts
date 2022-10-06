import Cookies from 'js-cookie';
import sinon from 'sinon';
import { UserSequentialMessageStateStore } from '../../../../../src/platforms/shared/sequential-messaging/infrastructure/user-sequential-message-state-store';
import { SequenceState } from '../../../../../src/platforms/shared/sequential-messaging/domain/data-structures/user-sequential-message-state';
import { expect } from 'chai';

const sampleState = { 5928558921: new SequenceState(1, 970, 250, true) };
const sampleCookie = { 5928558921: { stepNo: 1, width: 970, height: 250, uap: true } };

describe('User Sequential Message State Store', () => {
	it("Store user's sequential message state in a cookie", () => {
		const cookieSpy = sinon.spy(Cookies, 'set');

		const store = new UserSequentialMessageStateStore(Cookies);
		store.set(sampleState);

		sinon.assert.calledWith(
			cookieSpy,
			UserSequentialMessageStateStore.cookieName,
			JSON.stringify(sampleCookie),
		);
	});

	it("Retrieve user's sequential message state from a cookie", () => {
		const cookieMock = sinon.mock(Cookies);
		cookieMock
			.expects('get')
			.withArgs(UserSequentialMessageStateStore.cookieName)
			.returns(JSON.stringify(sampleCookie));

		const store = new UserSequentialMessageStateStore(Cookies);
		const userState = store.get();

		cookieMock.verify();
		expect(userState).to.eql(sampleState);
	});

	it('Attempt to retrieve not existing cookie', () => {
		const cookieMock = sinon.mock(Cookies);
		cookieMock.expects('get').withArgs(UserSequentialMessageStateStore.cookieName).returns(null);

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
