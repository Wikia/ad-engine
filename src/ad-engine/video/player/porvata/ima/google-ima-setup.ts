import { context, localCache, slotService } from '../../../../services';
import { logger, queryString } from '../../../../utils';
import { buildVastUrl } from '../../../vast-url-builder';
import { VideoParams } from '../video-settings';

const logGroup = 'google-ima-setup';

class GoogleImaSetup {
	createRequest(params: Partial<VideoParams>): google.ima.AdsRequest {
		const adSlot = slotService.get(params.slotName);
		const adsRequest = new window.google.ima.AdsRequest();
		const overriddenVast = this.getOverriddenVast();

		if (params.vastResponse || overriddenVast) {
			adsRequest.adsResponse = overriddenVast || params.vastResponse;
		}

		// DEPRECATED: options.porvata.audio.segment
		const segment = context.get('options.porvata.audio.segment');

		if (segment) {
			adSlot.setConfigProperty('audioSegment', params.autoPlay ? '' : segment);
		}

		adSlot.setConfigProperty('autoplay', params.autoPlay);
		adSlot.setConfigProperty('audio', !params.autoPlay);
		adSlot.setConfigProperty('targeting.autoplay', params.autoPlay ? 'yes' : 'no');
		adSlot.setConfigProperty('targeting.audio', !params.autoPlay ? 'yes' : 'no');

		adsRequest.adTagUrl =
			params.vastUrl ||
			buildVastUrl(params.width / params.height, params.slotName, {
				targeting: params.vastTargeting,
			});
		adsRequest.linearAdSlotWidth = params.width;
		adsRequest.linearAdSlotHeight = params.height;

		return adsRequest;
	}

	private getOverriddenVast(): null | string {
		if (queryString.get('porvata_override_vast') === '1' && localCache.isAvailable()) {
			const vastXML: string = localCache.get('porvata_vast');

			logger(logGroup, 'Overridden VAST', vastXML);

			return vastXML;
		}

		return null;
	}

	getRenderingSettings(params: Partial<VideoParams> = {}): google.ima.AdsRenderingSettings {
		const adsRenderingSettings = new window.google.ima.AdsRenderingSettings();
		const maximumRecommendedBitrate = 68000; // 2160p High Frame Rate

		if (!context.get('state.isMobile')) {
			adsRenderingSettings.bitrate = maximumRecommendedBitrate;
		}

		adsRenderingSettings.loadVideoTimeout = params.loadVideoTimeout || 15000;
		adsRenderingSettings.enablePreloading = true;
		adsRenderingSettings.uiElements = [];

		return adsRenderingSettings;
	}
}

export const googleImaSetup = new GoogleImaSetup();
