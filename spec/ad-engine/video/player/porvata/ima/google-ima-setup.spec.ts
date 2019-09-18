import { expect } from 'chai';
import { AdSlot } from '../../../../../../src/ad-engine/models/ad-slot';
import { context } from '../../../../../../src/ad-engine/services/context-service';
import { slotService } from '../../../../../../src/ad-engine/services/slot-service';
import { googleImaSetup } from '../../../../../../src/ad-products/video/player/porvata/ima/google-ima-setup';
import ConfigMock from '../../../../config-mock';

describe('google-ima-setup', () => {
	beforeEach(() => {
		window.google = {
			ima: {
				// tslint:disable-next-line
				AdsRenderingSettings: function() {},
				// tslint:disable-next-line
				AdsRequest: function() {},
				ViewMode: {
					NORMAL: 0,
				},
			},
		};
		context.extend(ConfigMock);
		slotService.add(new AdSlot({ id: 'top_leaderboard' }));
	});

	it('create request', () => {
		const request = googleImaSetup.createRequest({
			vastUrl: '/foo/bar',
			height: 25,
			slotName: 'top_leaderboard',
			width: 50,
		});

		expect(request.adTagUrl).to.equal('/foo/bar');
		expect(request.linearAdSlotWidth).to.equal(50);
		expect(request.linearAdSlotHeight).to.equal(25);
	});

	it('get rendering settings', () => {
		const settings = googleImaSetup.getRenderingSettings();

		expect(settings.enablePreloading).to.equal(true);
		expect(settings.uiElements.length).to.equal(0);
		expect(settings.loadVideoTimeout).to.equal(15000);
		expect(settings.bitrate).to.equal(68000);
	});

	it('get rendering settings with different load timeout', () => {
		const settings = googleImaSetup.getRenderingSettings({
			loadVideoTimeout: 10000,
		});

		expect(settings.loadVideoTimeout).to.equal(10000);
	});
});
