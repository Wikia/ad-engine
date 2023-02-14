import { once } from '@wikia/core/utils/flow-control';
import { expect } from 'chai';

function getHtmlElementStub(): any {
	let eventCallback;

	return {
		addEventListener: global.sandbox.stub().callsFake((name, callback) => {
			eventCallback = callback;
		}),
		runCallback: global.sandbox.stub().callsFake((...args) => {
			eventCallback(...args);
		}),
	};
}

describe('Flow control - once', () => {
	it('once returns a promise', () => {
		const object = getHtmlElementStub();
		const promise = once(object, 'xxx');

		expect(typeof promise.then === 'function').to.be.ok;
		expect(typeof promise.catch === 'function').to.be.ok;
	});

	it('once calls event subscribe method', () => {
		const object = getHtmlElementStub();

		once(object, 'xxx');
		object.runCallback();
		expect(object.addEventListener.calledWith('xxx')).to.be.ok;
		expect(true).to.equal(true);
	});
});
