import { expect } from 'chai';
import { vastDebugger } from '../../../src/ad-engine/video/vast-debugger';

describe('vast-debugger', () => {
	let elementMock;
	beforeEach(() => {
		elementMock = {
			setAttribute: (key, value) => {
				elementMock[key] = value;
			},
		};
	});

	it('set debug attributes on given element', () => {
		vastDebugger.setVastAttributesFromVastParams(elementMock, 'success', {
			contentType: 'application/javascript',
			creativeId: '123',
			lineItemId: '789',
			position: 'preroll',
			size: '640x480',
			customParams: {
				almostNumber: '1',
				string: 'buzz',
				array: 'red,green,blue',
			},
		});

		expect(elementMock['data-vast-content-type']).to.equal('application/javascript');
		expect(elementMock['data-vast-creative-id']).to.equal('123');
		expect(elementMock['data-vast-line-item-id']).to.equal('789');
		expect(elementMock['data-vast-position']).to.equal('preroll');
		expect(elementMock['data-vast-size']).to.equal('640x480');
		expect(elementMock['data-vast-status']).to.equal('success');
		expect(elementMock['data-vast-params']).to.equal(
			'{"almostNumber":"1","string":"buzz","array":["red","green","blue"]}',
		);
	});
});
