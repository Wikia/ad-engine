import { HIDDEN_AD_CLASS } from '@wikia/core';
import { getTopOffset } from '@wikia/core/utils';
import { expect } from 'chai';
import * as sinon from 'sinon';

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
	beforeEach(() => {
		global.sandbox.stub(window, 'pageXOffset').value(0);
		global.sandbox.stub(window, 'pageYOffset').value(200);
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
		expect(adSpy.calledWith(HIDDEN_AD_CLASS)).to.equal(true);
		expect(removeSpy.calledWith(HIDDEN_AD_CLASS)).to.equal(true);
	});
});
