import { expect } from 'chai';
import { vastDebugger } from '../../../src/ad-engine/video/vast-debugger';

describe('vast-debugger', () => {
	it('get attributes for given vastUrl', () => {
		const vastAttributes = vastDebugger.getVastAttributesFromVastParams('success', {
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

		expect(vastAttributes['data-vast-content-type']).to.equal('application/javascript');
		expect(vastAttributes['data-vast-creative-id']).to.equal('123');
		expect(vastAttributes['data-vast-line-item-id']).to.equal('789');
		expect(vastAttributes['data-vast-position']).to.equal('preroll');
		expect(vastAttributes['data-vast-size']).to.equal('640x480');
		expect(vastAttributes['data-vast-status']).to.equal('success');
		expect(vastAttributes['data-vast-params']).to.equal(
			'{"almostNumber":"1","string":"buzz","array":["red","green","blue"]}',
		);
	});
});
