import { PorvataListener } from '@wikia/ad-products/video/player/porvata/porvata-listener';
import { expect } from 'chai';
import { createSandbox, spy } from 'sinon';
import { context } from '../../../src/ad-engine/services/context-service';
import { slotService } from '../../../src/ad-engine/services/slot-service';

function getListener() {
	return {
		dispatchedEvents: [],
		onEvent(eventName, params, data) {
			this.dispatchedEvents.push({
				eventName,
				data,
			});
		},
	};
}

let customListener;
let sandbox;

describe('porvata-listener', () => {
	beforeEach(() => {
		sandbox = createSandbox();
		customListener = getListener();
		context.extend({
			listeners: {
				porvata: [customListener],
			},
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('dispatch Porvata event with all basic data', () => {
		new PorvataListener({ adProduct: 'test-video', position: 'abcd' }).init();

		expect(customListener.dispatchedEvents.length).to.equal(1);

		const { eventName, data } = customListener.dispatchedEvents[0];

		expect(eventName).to.equal('init');
		expect(data.ad_error_code).to.equal(0);
		expect(data.ad_product).to.equal('test-video');
		expect(data.content_type).to.equal('(none)');
		expect(data.creative_id).to.equal('');
		expect(data.event_name).to.equal('init');
		expect(data.line_item_id).to.equal('');
		expect(data.player).to.equal('porvata');
		expect(data.position).to.equal('abcd');
	});

	describe('init', () => {
		it('should dispatch Porvata event with ad data extracted from video container', () => {
			const listener = new PorvataListener({ adProduct: 'test-video' });
			listener.video = {
				container: {
					getAttribute: (attr: string): string => {
						return {
							'data-vast-content-type': 'content1',
							'data-vast-creative-id': 'creative1',
							'data-vast-line-item-id': 'line1',
						}[attr];
					},
				},
			};

			listener.init();

			expect(customListener.dispatchedEvents.length).to.equal(1);

			const { data } = customListener.dispatchedEvents[0];
			expect(data.content_type).to.equal('content1');
			expect(data.creative_id).to.equal('creative1');
			expect(data.line_item_id).to.equal('line1');
		});
	});

	it('dispatch video viewed event on ad-slot', () => {
		const listener = new PorvataListener({ adProduct: 'test-video', position: 'abcd' });

		const adSlotMock = { emit: spy(), getSlotName: () => {} };

		sandbox.stub(slotService, 'get').returns(adSlotMock);

		listener.dispatch(PorvataListener.EVENTS.viewable_impression);

		expect(adSlotMock.emit.called).to.be.true;
	});
});
