import {
	communicationService,
	context,
	CookieStorageAdapter,
	DiProcess,
	eventsRepository,
} from '@wikia/ad-engine';
import { gamefaqsConfig } from './gamefaqs-config';
import isMatch from 'lodash/isMatch.js';

interface CookieBasedTargetingParams {
	ftag?: string;
	ttag?: string;
	pv?: string;
	session?: string;
	subses?: string;
}

interface TargetingParams extends CookieBasedTargetingParams {
	con?: string;
	franchise?: string;
	game?: string;
	genre?: string;
	env?: string;
	publisher?: string;
	ptype?: string;
	rating?: string;
	rdate?: string;
	score?: string;
	user?: string;
	vguid?: string;
}

export class GamefaqsTargetingSetup implements DiProcess {
	execute(): Promise<void> | void {
		const targeting = {
			...this.getPageLevelTargeting(),
			...this.getCookieBasedTargeting(),
		};

		this.setSlotLevelTargeting(targeting);

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}

	getPageLevelTargeting() {
		const targetParams = this.getMetadataTargetingParams();
		const utagData = window.utag_data;

		return {
			con: targetParams?.con,
			franchise: targetParams?.franchise,
			game: targetParams?.game,
			genre: targetParams?.genre,
			publisher: targetParams?.publisher,
			ptype: utagData?.pageType,
			rating: targetParams?.rating,
			rdate: targetParams?.rdate,
			score: targetParams?.score,
			user: utagData?.userType,
			vguid: utagData?.pageViewGuid,
		};
	}

	getMetadataTargetingParams(): TargetingParams {
		const dataSettingsElement = document.head
			.querySelector('[id=ad-settings]')
			.getAttribute('data-settings');
		return JSON.parse(dataSettingsElement).target_params;
	}

	// Transfered from: https://github.com/Wikia/player1-ads-adlibrary/blob/0df200c535adf3599c7de9e99b719953af2784e1/core/targeting.js#L205
	getCookieBasedTargeting(): CookieBasedTargetingParams {
		const cookieAdapter = new CookieStorageAdapter();
		const browserSessionCookie = '_BB.bs';
		const dailySessionCookie = '_BB.d';

		const consolidate = gamefaqsConfig.targeting.cookie.consolidate;
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
			].slice(0, gamefaqsConfig.targeting.seats.session);
			const session = availableSessions[Math.floor(Math.random() * availableSessions.length)];
			const subsession = (
				Math.floor(Math.random() * gamefaqsConfig.targeting.seats.subsession) + 1
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
		const keyMap = gamefaqsConfig.targeting.cookie.keyMap;

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

		const browserSessionData = bbCookies[0] ? JSON.parse(bbCookies[0]) : {};
		const dailySessionData = bbCookies[1] ? JSON.parse(bbCookies[1]) : {};

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

	// Transfered from: https://github.com/Wikia/player1-ads-adlibrary/blob/0df200c535adf3599c7de9e99b719953af2784e1/configs/global-config.js
	setSlotLevelTargeting(targeting) {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot: adSlot }) => {
				adSlot.config.targeting.sl = this.getSlValue(adSlot);
				adSlot.config.targeting.iid = this.getIidValue(adSlot, targeting);
			},
			false,
		);
	}

	getSlValue(adSlot) {
		const slParams = [];

		if (adSlot.getConfigProperty('lazyLoad')) {
			slParams.push('LL');
		}

		if (gamefaqsConfig.timeouts.bidder) {
			slParams.push(`T-${gamefaqsConfig.timeouts.bidder}`);
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
}
