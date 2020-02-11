import { DeviceMode } from '@platforms/shared';

export function getTripleliftContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 250]],
					inventoryCodes: ['Gamepedia_Desktop_TopLeaderboard_prebid'],
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					inventoryCodes: ['Gamepedia_Desktop_TopRightSticky_hdx_prebid'],
				},
				'03_PF': {
					sizes: [[300, 250]],
					inventoryCodes: ['Gamepedia_Desktop_Footer_300x250_hdx_prebid'],
				},
				'04_BLB': {
					sizes: [[728, 90]],
					inventoryCodes: ['Gamepedia_Desktop_Footer_728x90_hdx_prebid'],
				},
				'06_FMR': {
					sizes: [[300, 250]],
					inventoryCodes: ['Gamepedia_Desktop_SecondRightSticky_hdx_prebid'],
				},
			},
		},

		mobile: {
			enabled: false,
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					inventoryCodes: ['Gamepedia_Mobile_Sticky_320x50_hdx_prebid'],
				},
				'02_MR': {
					sizes: [[300, 250]],
					inventoryCodes: ['Gamepedia_Mobile_Incontent_300x250_prebid'],
				},
				'06_FMR': {
					sizes: [[300, 250]],
					inventoryCodes: ['Gamepedia_Mobile_Footer_300x250_hdx_prebid'],
				},
			},
		},
	};

	return context[device];
}
