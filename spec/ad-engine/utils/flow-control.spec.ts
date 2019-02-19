import { expect } from 'chai';
import sinon from 'sinon';
import { once } from '../../../src/ad-engine/utils/flow-control';

const getMockObject = () => {
	let eventCallback;

	return {
		addEventListener: (name, callback) => {
			eventCallback = callback;
		},
		runCallback: (...args) => {
			eventCallback(...args);
		},
	};
};
let object;

describe('Flow control - once', () => {
	beforeEach(() => {
		object = getMockObject();
	});

	it('once returns a promise', () => {
		const promise = once(object, 'xxx');

		expect(typeof promise.then === 'function').to.be.ok;
		expect(typeof promise.catch === 'function').to.be.ok;
	});

	it('once calls event subscribe method', () => {
		sinon.spy(object, 'addEventListener');

		once(object, 'xxx');
		object.runCallback();
		expect(object.addEventListener.calledWith('xxx')).to.be.ok;
	});
});
