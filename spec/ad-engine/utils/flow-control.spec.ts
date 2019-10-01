import { once } from '@wikia/ad-engine/utils/flow-control';
import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';

function getHtmlElementStub(sandbox: SinonSandbox): any {
	let eventCallback;

	return {
		addEventListener: sandbox.stub().callsFake((name, callback) => {
			eventCallback = callback;
		}),
		runCallback: sandbox.stub().callsFake((...args) => {
			eventCallback(...args);
		}),
	};
}

describe('Flow control - once', () => {
	const sandbox = createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it('once returns a promise', () => {
		const object = getHtmlElementStub(sandbox);
		const promise = once(object, 'xxx');

		expect(typeof promise.then === 'function').to.be.ok;
		expect(typeof promise.catch === 'function').to.be.ok;
	});

	it('once calls event subscribe method', () => {
		const object = getHtmlElementStub(sandbox);

		once(object, 'xxx');
		object.runCallback();
		expect(object.addEventListener.calledWith('xxx')).to.be.ok;
		expect(true).to.equal(true);
	});
});
