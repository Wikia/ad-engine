import { AdSlot, context, slotService, TargetingService, targetingService } from '@wikia/core';
import { VideoEventProvider } from '@wikia/core/video/video-event-provider';
import { assert } from 'chai';
import { SinonStubbedInstance } from 'sinon';
import { configMock } from '../config-mock';

describe('Video event data provider', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		global.sandbox.stub(document, 'hidden').get(() => undefined);
		context.extend(configMock);
		context.set('geo.country', 'PL');
		targetingServiceStub = global.sandbox.stub(targetingService);
		targetingServiceStub.get.withArgs('skin').returns('ae3');
		window.fandomContext = {
			...window.fandomContext,
			tracking: {
				pvNumber: 5,
			},
		};
		slotService.add(new AdSlot({ id: 'incontent_player' }));
	});

	afterEach(() => {
		context.remove('geo.country');
		delete window.fandomContext;
	});

	it('returns list of values to track', () => {
		const videoData: any = {
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
		};
		const data = VideoEventProvider.getEventData(videoData);

		assert.equal(data.ad_error_code, 900);
		assert.equal(data.ad_product, 'foo');
		assert.equal(data.audio, 0);
		assert.equal(typeof data.browser, 'string');
		assert.equal(data.content_type, 'video/mp4');
		assert.equal(data.country, 'PL');
		assert.equal(data.creative_id, 123 as any);
		assert.equal(data.ctp, 0);
		assert.equal(data.event_name, 'start');
		assert.equal(data.line_item_id, 987 as any);
		assert.equal(data.player, 'player-name');
		assert.equal(data.position, 'incontent_player');
		assert.equal(data.pv_number, 5);
		assert.equal(data.skin, 'ae3');
		assert.equal(typeof data.timestamp, 'number');
		assert.equal(data.user_block_autoplay, -1);
		assert.equal(data.video_id, 'bar');
	});
});
