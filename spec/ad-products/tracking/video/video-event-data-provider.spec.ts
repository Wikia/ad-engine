import { assert } from 'chai';
import { AdSlot, context, slotService } from '../../../../src/ad-engine';
import videoEventDataProvider from '../../../../src/ad-products/tracking/video/video-event-data-provider';
import configMock from '../../../ad-engine/config-mock';

describe('Video event data provider', () => {
	beforeEach(() => {
		context.extend(configMock);
		context.set('targeting.skin', 'ae3');
		context.set('slots.incontent_player.targeting.wsi', 'xxx1');
		slotService.add(new AdSlot({ id: 'incontent_player' }));
		window.pvNumber = 5;
	});

	it('returns list of values to track', () => {
		const data = videoEventDataProvider.getEventData({
			ad_error_code: 900,
			ad_product: 'foo',
			audio: false,
			content_type: 'video/mp4',
			creative_id: 123,
			ctp: false,
			event_name: 'start',
			line_item_id: 987,
			player: 'player-name',
			position: 'incontent_player',
			user_block_autoplay: -1,
			video_id: 'bar',
		});

		assert.equal(data.ad_error_code, 900);
		assert.equal(data.ad_product, 'foo');
		assert.equal(data.audio, 0);
		assert.equal(typeof data.browser, 'string');
		assert.equal(data.content_type, 'video/mp4');
		assert.equal(data.country, 'PL');
		assert.equal(data.creative_id, 123);
		assert.equal(data.ctp, 0);
		assert.equal(data.document_visibility, 'not_implemented');
		assert.equal(data.event_name, 'start');
		assert.equal(data.line_item_id, 987);
		assert.equal(data.player, 'player-name');
		assert.equal(data.position, 'incontent_player');
		assert.equal(data.pv_number, 5);
		assert.equal(data.price, '');
		assert.equal(data.skin, 'ae3');
		assert.equal(typeof data.timestamp, 'number');
		assert.equal(data.user_block_autoplay, -1);
		assert.equal(data.video_id, 'bar');
		assert.equal(data.wsi, 'xxx1');
	});
});
