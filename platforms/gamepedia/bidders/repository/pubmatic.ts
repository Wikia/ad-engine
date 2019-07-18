import { DeviceMode } from '../../models/device-mode';

export function getPubmaticContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			publisherId: '156260',
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 150], [970, 250]],
					ids: [
						'Desktop_TopLeaderboard_728x90_Gamepedia',
						'Desktop_TopLeaderboard_970x150_Gamepedia',
						'Desktop_TopLeaderboard_970x250_Gamepedia',
					],
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					ids: [
						'Desktop_TopRightSticky_300x250_Gamepedia',
						'Desktop_TopRightSticky_300x600_Gamepedia',
					],
				},
				'03_PF': {
					sizes: [[300, 250]],
					ids: ['Desktop_Footer_300x250_Gamepedia'],
				},
				'04_BLB': {
					sizes: [[728, 90]],
					ids: ['Desktop_Footer_728x90_Gamepedia'],
				},
				'06_FMR': {
					sizes: [[300, 250]],
					ids: ['Desktop_SecondRightSticky_300x250_Gamepedia'],
				},
			},
		},

		mobile: {
			enabled: false,
			publisherId: '156260',
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					ids: ['Mobile_Sticky_320x50_Gamepedia'],
				},
				'02_MR': {
					sizes: [[300, 250]],
					ids: ['Mobile_Incontent_300x250_Gamepedia'],
				},
				'06_FMR': {
					sizes: [[300, 250]],
					ids: ['Mobile_Footer_300x250_Gamepedia'],
				},
			},
		},
	};

	return context[device];
}
