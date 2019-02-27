import { expect } from 'chai';
import { createSandbox, spy } from 'sinon';
import { PorvataListener } from '../../../src/ad-engine/listeners/porvata-listener';
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

function mockImaVideo() {
	return {
		ima: {
			getAdsManager() {
				return {
					getCurrentAd() {
						return {
							getAdId() {
								return 765;
							},
							getCreativeId() {
								return 123;
							},
							getContentType() {
								return 'video/mp4';
							},
							getWrapperAdIds() {},
							getWrapperCreativeIds() {},
							getWrapperAdSystems() {},
						};
					},
				};
			},
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
		expect(typeof data.browser).to.equal('string');
		expect(data.content_type).to.equal('(none)');
		expect(data.creative_id).to.equal(0);
		expect(data.event_name).to.equal('init');
		expect(data.line_item_id).to.equal(0);
		expect(data.player).to.equal('porvata');
		expect(data.position).to.equal('abcd');
		expect(typeof data.timestamp).to.equal('number');
	});

	it('dispatch Porvata event with video data', () => {
		const listener = new PorvataListener({ adProduct: 'test-video' });

		listener.video = mockImaVideo();
		listener.init();

		expect(customListener.dispatchedEvents.length).to.equal(1);

		const { data } = customListener.dispatchedEvents[0];

		expect(data.content_type).to.equal('video/mp4');
		expect(data.creative_id).to.equal(123);
		expect(data.line_item_id).to.equal(765);
	});

	it('dispatch video viewed event on ad-slot', () => {
		const listener = new PorvataListener({ adProduct: 'test-video', position: 'abcd' });

		const adSlotMock = { emit: spy(), getSlotName: () => {} };

		sandbox.stub(slotService, 'get').returns(adSlotMock);

		listener.dispatch(PorvataListener.EVENTS.viewable_impression);

		expect(adSlotMock.emit.called).to.be.true;
	});
});
