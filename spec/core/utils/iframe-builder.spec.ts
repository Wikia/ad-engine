// @ts-strict-ignore
import { IframeBuilder } from '@wikia/core/utils';
import { assert } from 'chai';

describe('IFrameBuilder', () => {
	let iframeBuilder;
	const mock = {
		div: undefined,
	};

	beforeEach(() => {
		iframeBuilder = new IframeBuilder();
	});

	describe('create', () => {
		let iframe;

		beforeEach(() => {
			mock.div = document.createElement('div');
			iframe = iframeBuilder.create(mock.div);
		});

		it('should create iframe', () => {
			assert.equal(iframe.tagName, 'IFRAME');
		});

		it('should append iframe to passed element', () => {
			assert.equal(mock.div.children[0], iframe);
		});

		it('iframe should be styled', () => {
			assert.equal(iframe.frameBorder, 0);
			assert.equal(iframe.marginWidth, 0);
			assert.equal(iframe.marginHeight, 0);
		});
	});
});
