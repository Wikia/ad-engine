import { expect } from 'chai';
import { createSandbox, SinonSandbox, SinonSpy, SinonStub } from 'sinon';

import { MessageBus } from '@wikia/ad-engine';

const mockOrigin = 'https://example.com';

function getMessageEvent(data: any, origin?: string): Partial<MessageEvent> {
	return {
		data,
		origin: origin || mockOrigin,
	};
}

class MockWindow implements Pick<Window, 'addEventListener'> {
	cb: (...any) => any;

	addEventListener(type: string, cb: (...any) => any, any): void {
		this.cb = cb;
	}

	dispatchMessage({ data, origin }: { data: any; origin?: string }): void {
		if (this.cb) {
			this.cb(getMessageEvent(data, origin));
		}
	}
}

describe('message-bus', () => {
	let mockWindow: MockWindow;
	let messageBus: MessageBus;
	let cbStub: SinonStub;
	const sandbox: SinonSandbox = createSandbox();

	beforeEach(() => {
		mockWindow = new MockWindow();
		messageBus = new MessageBus(mockWindow);
		cbStub = sandbox.stub();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('init', () => {
		it('should add event listener only once if called multiple times', () => {
			const addEventListenerSpy: SinonSpy = sandbox.spy(mockWindow, 'addEventListener');

			messageBus.init();

			expect(addEventListenerSpy.callCount).to.equal(1);

			messageBus.init();

			expect(addEventListenerSpy.callCount).to.equal(1);
		});
	});

	describe('register', () => {
		it('should execute callback when message includes the "AdEngine" key', () => {
			const payload = {};

			messageBus.register({}, cbStub);
			mockWindow.dispatchMessage({ data: { AdEngine: payload } });

			expect(cbStub.callCount).to.equal(1);
			expect(cbStub.getCall(0).args[0]).to.equal(payload);
		});

		it('should not execute callback when message does not include the "AdEngine" key', () => {
			const payload = {};

			messageBus.register({}, cbStub);
			mockWindow.dispatchMessage({ data: { foo: payload } });

			expect(cbStub.callCount).to.equal(0);
		});

		it('should execute callback when event origin matches origin in match object', () => {
			const payload = {};

			messageBus.register({ origin: [mockOrigin] }, cbStub);
			mockWindow.dispatchMessage({ data: { AdEngine: payload }, origin: mockOrigin });

			expect(cbStub.callCount).to.equal(1);
			expect(cbStub.getCall(0).args[0]).to.equal(payload);
		});

		it('should not execute callback when event origin does not match origin in match object', () => {
			messageBus.register({ origin: [mockOrigin] }, cbStub);
			mockWindow.dispatchMessage({ data: { AdEngine: {} }, origin: 'https://foo.com' });

			expect(cbStub.callCount).to.equal(0);
		});

		it.skip('should execute callback when payload includes all keys specified in match object', () => {
			expect(true).to.equal(false);
		});

		it.skip('should not execute callback when payload does not include all keys specified in match object', () => {
			expect(true).to.equal(false);
		});
	});
});
