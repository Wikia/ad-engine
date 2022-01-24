import { SequentialMessageState } from '@wikia/sequential-messaging';
import { expect } from 'chai';
import Cookies from 'js-cookie';
import sinon, { assert } from 'sinon';
import {
	CookieSequentialMessageStateStore,
	// tslint:disable-next-line:max-line-length
} from '../../../../../platforms/shared/sequential-messaging/infrastructure/cookie-sequential-message-state-store';

function state(id: string, no?: number, sqTs?: number, startTs?: number): SequentialMessageState {
	return {
		sequenceMessageId: id,
		sequenceNo: no,
		sequenceTimestamp: sqTs,
		startedTimestamp: startTs,
	};
}

let sandbox: sinon.SinonSandbox;
let getStub: sinon.SinonStub;
let saveSpy: sinon.SinonSpy;
let store: CookieSequentialMessageStateStore;

describe('Cookie Sequential Message State Store', () => {
	beforeEach(() => {
		sandbox = sinon.createSandbox();
		getStub = sandbox.stub(Cookies, 'get');
		saveSpy = sandbox.spy(Cookies, 'set');
		store = new CookieSequentialMessageStateStore();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Should serialise full state', () => {
		// given
		const sampleState = state('id', 1, 2, 15);

		// when
		store.save(sampleState);

		// then
		assert.calledWith(saveSpy, CookieSequentialMessageStateStore.COOKIE_NAME, 'id|1|2|f');
	});

	it('Should serialise full state', () => {
		// given
		const sampleState = state('id');

		// when
		store.save(sampleState);

		// then
		assert.calledWith(saveSpy, CookieSequentialMessageStateStore.COOKIE_NAME, 'id|0|0|0');
	});

	it('Should deserialise full state', () => {
		// given
		getStub.returns('id|0|1|f');

		// when
		const result = store.get();

		// then
		expect(result).to.contains(state('id', 0, 1, 15));
	});

	it('Should not read invalid state', () => {
		// given
		getStub.returns('id|0|1asdg');

		// when
		const result = store.get();

		// then
		expect(result).to.equal(undefined);
	});
});
