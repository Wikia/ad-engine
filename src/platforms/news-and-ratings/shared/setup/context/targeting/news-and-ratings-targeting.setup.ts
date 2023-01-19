import {
	communicationService,
	context,
	CookieStorageAdapter,
	DiProcess,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import isMatch from 'lodash/isMatch.js';
import { CookieBasedTargetingParams, TargetingParams } from './interfaces/targeting-params';

export class NewsAndRatingsTargetingSetup implements DiProcess {
	execute(): void {
		const customConfig = context.get('custom');

		const targeting = {
			...this.getPageLevelTargeting(),
			...this.getCookieBasedTargeting(customConfig),
			...this.getForcedCampaignsTargeting(),
		};

		this.setSlotLevelTargeting(targeting, customConfig);

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}

	getPageLevelTargeting(): TargetingParams {
		const targetParams = this.getMetadataTargetingParams();
		const utagData = window.utag_data;

		let targeting: TargetingParams = {};

		if (targetParams) {
			for (const [key, value] of Object.entries(targetParams)) {
				targeting[key] = value;
			}
		}

		targeting = {
			...targeting,
			ptype: utagData?.pageType,
			user: utagData?.userType,
			vguid: this.getViewGuid(),
		};

		return targeting;
	}

	getMetadataTargetingParams(): TargetingParams {
		const dataSettingsElement = document.head
			.querySelector('[id=ad-settings]')
			?.getAttribute('data-settings');

		if (dataSettingsElement) {
			return JSON.parse(dataSettingsElement)?.target_params;
		}

		return null;
	}

	getViewGuid() {
		const el = document.getElementById('view-guid-meta');
		const key = 'content';

		let guid;

		if (el && el.hasAttribute(key)) {
			guid = el.getAttribute(key);
		}

		return guid;
	}

	// Transfered from: https://github.com/Wikia/player1-ads-adlibrary/blob/0df200c535adf3599c7de9e99b719953af2784e1/core/targeting.js#L205
	getCookieBasedTargeting(customConfig): CookieBasedTargetingParams {
		const cookieAdapter = new CookieStorageAdapter();
		const browserSessionCookie = '_BB.bs';
		const dailySessionCookie = '_BB.d';

		const consolidate = customConfig.targeting.cookie.consolidate;
		let surround = null;
		const surroundCookie = cookieAdapter.getItem('surround');

		if (surroundCookie) {
			surround = surroundCookie.split('|');
			if (consolidate) {
				cookieAdapter.removeItem('surround');
			}
		} else {
			const availableSessions = [
				'a',
				'b',
				'c',
				'd',
				'e',
				'f',
				'g',
				'h',
				'i',
				'j',
				'k',
				'l',
				'm',
				'n',
				'o',
				'p',
				'q',
				'r',
				's',
				't',
				'u',
				'v',
				'w',
				'x',
				'y',
				'z',
			].slice(0, customConfig.targeting.seats.session);
			const session = availableSessions[Math.floor(Math.random() * availableSessions.length)];
			const subsession = (
				Math.floor(Math.random() * customConfig.targeting.seats.subsession) + 1
			).toString();
			surround = [session, subsession];
		}

		const bbCookies = [
			cookieAdapter.getItem(browserSessionCookie),
			cookieAdapter.getItem(dailySessionCookie),
		];

		const existingCookies: CookieBasedTargetingParams = {
			session: surround[0],
			subses: surround[1],
		};

		const cookieKeyMapKeys = ['session', 'subses', 'ftag', 'ttag'];
		const keyMap = customConfig.targeting.cookie.keyMap;

		for (let i = 0; i < cookieKeyMapKeys.length; i += 1) {
			const key = cookieKeyMapKeys[i];
			if (keyMap[key]) {
				const value = cookieAdapter.getItem(keyMap[key]);
				if (value) {
					existingCookies[key] = value;
					if (consolidate) {
						cookieAdapter.removeItem(keyMap[key]);
					}
				}
			}
		}

		const browserSessionData = this.isJsonString(bbCookies[0]) ? JSON.parse(bbCookies[0]) : {};
		const dailySessionData = this.isJsonString(bbCookies[1]) ? JSON.parse(bbCookies[1]) : {};

		const result: CookieBasedTargetingParams = {
			ttag: dailySessionData.ttag || existingCookies.ttag,
			ftag: dailySessionData.ftag || existingCookies.ftag,
			session: browserSessionData.session || existingCookies.session,
			subses: browserSessionData.subses || existingCookies.subses,
			pv: dailySessionData.pv || existingCookies.pv || '0',
		};

		if (!consolidate) {
			cookieAdapter.removeItem(browserSessionCookie);
			cookieAdapter.removeItem(dailySessionCookie);
		}

		if (typeof result.pv !== 'undefined') {
			let currentPvNumber = parseInt(result.pv, 10);

			currentPvNumber += 1;

			result.pv = currentPvNumber.toString();
		}

		if (consolidate) {
			const bbBrowserSession = { session: result.session, subses: result.subses };
			const bbDailySession = { ttag: result.ttag, ftag: result.ftag, pv: result.pv };

			if (!isMatch(bbCookies[0], bbBrowserSession)) {
				cookieAdapter.setItem(browserSessionCookie, JSON.stringify(bbBrowserSession));
			}
			if (!isMatch(bbCookies[1], bbDailySession)) {
				cookieAdapter.setItem(dailySessionCookie, JSON.stringify(bbDailySession));
			}
		} else {
			if (result.session !== existingCookies.session) {
				cookieAdapter.setItem('session', result.session);
			}
			if (result.subses !== existingCookies.subses) {
				cookieAdapter.setItem('subses', result.subses);
			}
		}

		if (!consolidate) {
			if (result.ftag !== existingCookies.ftag) {
				cookieAdapter.setItem('ftag', result.ftag);
			}
			if (result.ttag !== existingCookies.ttag) {
				cookieAdapter.setItem('ttag', result.ttag);
			}
		}

		return result;
	}

	getForcedCampaignsTargeting() {
		if (utils.queryString.get('cid')) {
			return {
				cid: utils.queryString.get('cid'),
			};
		}

		if (utils.queryString.get('adTargeting_campaign')) {
			return {
				campaign: utils.queryString.get('adTargeting_campaign'),
			};
		}

		return {};
	}

	// Transfered from: https://github.com/Wikia/player1-ads-adlibrary/blob/0df200c535adf3599c7de9e99b719953af2784e1/configs/global-config.js
	setSlotLevelTargeting(targeting, customConfig) {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot: adSlot }) => {
				adSlot.config.targeting.sl = this.getSlValue(adSlot, customConfig);
				adSlot.config.targeting.iid = this.getIidValue(adSlot, targeting);
			},
			false,
		);
	}

	getSlValue(adSlot, customConfig) {
		const slParams = [];

		if (adSlot.getConfigProperty('lazyLoad')) {
			slParams.push('LL');
		}

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
}
