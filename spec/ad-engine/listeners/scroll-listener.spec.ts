import { AdStackPayload, ScrollListener } from '@wikia/ad-engine';
import { OldLazyQueue } from '@wikia/ad-engine/utils';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('ScrollListener', () => {
	let scrollListener: ScrollListener;
	let getElementByIdStub;
	let addCallbackStub;

	beforeEach(() => {
		scrollListener = new ScrollListener();
		getElementByIdStub = sinon.stub(document, 'getElementById');
		getElementByIdStub.callsFake(() => 'fakeNode');
		addCallbackStub = sinon.stub(scrollListener, 'addCallback');
		addCallbackStub.callsFake(() => {});
	});

	afterEach(() => {
		getElementByIdStub.restore();
		addCallbackStub.restore();
	});

	describe('addSlot', () => {
		it('should not call addCallback if node with provided ID cannot be found', () => {
			getElementByIdStub.callsFake(() => null);

			scrollListener.addSlot('nodeId', { threshold: 5 });
			scrollListener.addSlot('nodeId', { distanceFromTop: 10 });

			expect(addCallbackStub.called).to.be.false;
		});

		it('should not call addCallback if both threshold and distanceFromTop are missing', () => {
			scrollListener.addSlot('nodeId');
			scrollListener.addSlot('nodeId', {});

			expect(addCallbackStub.called).to.be.false;
		});

		it('should not call addCallback if both threshold and distanceFromTop are supplied', () => {
			scrollListener.addSlot('nodeId', { threshold: 20, distanceFromTop: 10 });

			expect(addCallbackStub.called).to.be.false;
		});

		it('should call scrollListener.addCallback if only distanceFromTop is supplied', () => {
			scrollListener.addSlot('nodeId', { distanceFromTop: 10 });

			expect(addCallbackStub.called).to.be.true;
		});

		it('should call scrollListener.addCallback if only threshold is supplied', () => {
			scrollListener.addSlot('nodeId', { threshold: 10 });

			expect(addCallbackStub.called).to.be.true;
		});
	});
});
