import { expect } from 'chai';
import * as sinon from 'sinon';
import { getTopOffset } from '../../../src/ad-engine/utils';

function mockWindow(top: number, left = 0): void {
	sinon.stub(window, 'pageXOffset').value(left);
	sinon.stub(window, 'pageYOffset').value(top);
}

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
	it('getTopOffset of single element', () => {
		mockWindow(200);
		const element = getMockElement(-150);

		expect(getTopOffset(element)).to.equal(50);
	});

	it('getTopOffset of hidden element', () => {
		mockWindow(200);
		const element = getMockElement(100, 0, true);
		const adSpy = sinon.spy(element.classList, 'add');
		const removeSpy = sinon.spy(element.classList, 'remove');

		expect(getTopOffset(element)).to.equal(300);
		expect(adSpy.calledWith('hide')).to.equal(true);
		expect(removeSpy.calledWith('hide')).to.equal(true);
	});
});
