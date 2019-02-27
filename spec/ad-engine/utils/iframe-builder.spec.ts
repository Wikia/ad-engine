import { IframeBuilder } from '@wikia/ad-engine/utils';
import { assert } from 'chai';
import sinon from 'sinon';

describe('IFrameBuilder', () => {
	let sandbox;
	let iframeBuilder;
	const mock = {
		div: undefined,
		adSlot: undefined,
	};

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		iframeBuilder = new IframeBuilder();
	});

	describe('create', () => {
		let iframe;

		beforeEach(() => {
			mock.div = document.createElement('div');
			mock.adSlot = {
				getElement: () => mock.div,
			};
			iframe = iframeBuilder.create(mock.adSlot);
		});

		it('should create iframe', () => {
			assert.equal(iframe.tagName, 'IFRAME');
		});

		it('should append iframe to adSlot element', () => {
			assert.equal(mock.div.children[0], iframe);
		});

		it('iframe should be styled', () => {
			assert.equal(iframe.frameBorder, 0);
			assert.equal(iframe.marginWidth, 0);
			assert.equal(iframe.marginHeight, 0);
		});
	});

	afterEach(() => {
		sandbox.restore();
	});
});
