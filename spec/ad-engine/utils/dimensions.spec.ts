import { expect } from 'chai';
import * as sinon from 'sinon';
import { getTopOffset } from '../../../src/ad-engine/utils';

function getMockElement(top: number, left = 0, hidden = false): HTMLElement {
	return {
		classList: {
			add: () => {},
			contains: () => hidden,
			remove: () => {},
		},
		style: {},
		getBoundingClientRect: () => ({
			top,
			left,
		}),
	} as any;
}

describe('dimensions', () => {
	const sandbox = sinon.createSandbox();

	beforeEach(() => {
		sandbox.stub(window, 'pageXOffset').value(0);
		sandbox.stub(window, 'pageYOffset').value(200);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('getTopOffset of single element', () => {
		const element = getMockElement(-150);

		expect(getTopOffset(element)).to.equal(50);
	});

	it('getTopOffset of hidden element', () => {
		const element = getMockElement(100, 0, true);
		const adSpy = sinon.spy(element.classList, 'add');
		const removeSpy = sinon.spy(element.classList, 'remove');

		expect(getTopOffset(element)).to.equal(300);
		expect(adSpy.calledWith('hide')).to.equal(true);
		expect(removeSpy.calledWith('hide')).to.equal(true);
	});
});
