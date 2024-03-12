import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { queryString } from '@ad-engine/utils';
import { setupNpaContext, setupRdpContext } from '@wikia/ad-products';
import { TargetingParams } from './interfaces/targeting-params';

export class NewsAndRatingsTargetingSetup implements DiProcess {
	execute(): void {
		const customConfig = context.get('custom');

		const targeting = {
			...this.getPageLevelTargeting(),
			...this.getViewGuid(),
			...this.getForcedCampaignsTargeting(),
		};

		this.setPageLevelTargeting(targeting);
		this.setSlotLevelTargeting(targeting, customConfig);

		targetingService.extend({
			...targetingService.dump(),
			...targeting,
			is_mobile: context.get('state.isMobile') ? '1' : '0',
			uap: 'none',
			uap_c: 'none',
		});

		this.setupPageType();
		setupNpaContext();
		setupRdpContext();
	}

	getPageLevelTargeting(): TargetingParams {
		const adTags = this.getAdTags();
		const parsedAdTags = this.parseAdTags(adTags);

		return this.getMappedAdTags(parsedAdTags);
	}

	getAdTags(): string {
		return document.head.querySelector('[name=adtags]')?.getAttribute('content');
	}

	parseAdTags(adTags: string): object {
		if (!adTags) {
			return;
		}

		return Object.fromEntries(new URLSearchParams(adTags));
	}

	getMappedAdTags(adTagsToMap: object): TargetingParams {
		if (!adTagsToMap) {
			return;
		}

		const mappedAdTags: TargetingParams = {};

		for (const [key, orgValue] of Object.entries(adTagsToMap)) {
			const value = NewsAndRatingsTargetingSetup.splitMultiValueTag(orgValue);

			switch (key) {
				case 'cid':
					mappedAdTags['slug'] = orgValue.split(',')[0] ?? 'null';
					break;
				case 'con':
				case 'platforms':
					mappedAdTags['pform'] = value;
					break;
				case 'franchise':
					mappedAdTags['franchise_nr'] = value;
					break;
				case 'franchiseRoot':
				case 'franchises':
					mappedAdTags['franchise'] = value;
					break;
				case 'genre':
				case 'genres':
					mappedAdTags['gnre'] = value;
					break;
				case 'network':
					mappedAdTags['tv'] = value;
					break;
				case 'publishers':
					mappedAdTags['pub'] = value;
					break;
				case 'themes':
					mappedAdTags['theme'] = value;
					break;
				default:
					mappedAdTags[key] = value;
			}
		}

		return mappedAdTags;
	}

	private static splitMultiValueTag(value: string): string | string[] {
		const values = value?.split(',');

		return values?.length > 1 ? values : value;
	}

	getViewGuid() {
		const pageViewGuid = this.getViewGuidFromGtagData() || this.getViewGuidFromMetaTag();
		return { vguid: pageViewGuid };
	}

	getViewGuidFromGtagData() {
		const tagData = window.dataLayer.find(({ event }) => event === 'Pageview');
		return tagData?.pageview_id;
	}

	getViewGuidFromMetaTag() {
		const el = document.getElementById('view-guid-meta');
		const key = 'content';

		let pageViewGuid = '';

		if (el && el.hasAttribute(key)) {
			pageViewGuid = el.getAttribute(key);
		}

		return pageViewGuid;
	}

	getForcedCampaignsTargeting() {
		if (queryString.get('cid')) {
			return {
				cid: queryString.get('cid'),
			};
		}

		if (queryString.get('adTargeting_campaign')) {
			return {
				campaign: queryString.get('adTargeting_campaign'),
			};
		}

		return {};
	}

	// Transfered from: https://github.com/Wikia/player1-ads-adlibrary/blob/0df200c535adf3599c7de9e99b719953af2784e1/configs/global-config.js
	setSlotLevelTargeting(targeting, customConfig) {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot: adSlot }) => {
				adSlot.setTargetingConfigProperty('sl', this.getSlValue(adSlot, customConfig));
				adSlot.setTargetingConfigProperty('iid', this.getIidValue(adSlot, targeting));
				adSlot.setTargetingConfigProperty('pageType', targeting.pname ?? '-1');
			},
			false,
		);
	}

	setPageLevelTargeting(targeting) {
		targetingService.set('pageType', targeting['pageType'] ?? '-1');
		targetingService.set('pname', targeting['pname'] ?? '-1');
		targetingService.set('ptype', targeting['ptype'] ?? '-1');
		targetingService.set('slug', targeting['slug'] ?? '-1');
		targetingService.set('pid', targeting['pid'] ?? '-1');
		targetingService.set('section', targeting['section'] ?? '-1');
		context.set('custom.pageType', targeting['pname'] ?? 'front-door');
	}

	getSlValue(adSlot, customConfig) {
		const slParams = [];

		if (customConfig.timeouts.bidder) {
			slParams.push(`T-${customConfig.timeouts.bidder}`);
		}

		return adSlot.getSlotName() + (slParams.length > 0 ? '?' + slParams.join('|') : '');
	}

	getIidValue(adSlot, targeting) {
		let iid = `unit=${adSlot.getSlotName()}|`;

		if (targeting.vguid) {
			iid = iid + `vguid=${targeting.vguid}|`;
		}

		if (targeting.pv) {
			iid = iid + `pv=${targeting.pv}`;
		}

		return iid;
	}

	isJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	private setupPageType(): void {
		const pageType: string =
			window.fandomContext?.video?.playerLoaded === true ? 'video' : 'article';
		targetingService.set('s2', pageType);
	}
}
