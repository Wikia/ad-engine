import { DeviceMode } from '@platforms/shared';

export function getPubmaticContext(device: DeviceMode): any {
	const context = {
		desktop: {
			enabled: false,
			publisherId: '156260',
			slots: {
				'01_LB': {
					sizes: [[728, 90], [970, 250]],
					ids: ['Desktop_TopLeaderboard_728x90_Futhead', 'Desktop_TopLeaderboard_970x250_Futhead'],
				},
				'02_MR': {
					sizes: [[300, 250], [300, 600]],
					ids: ['Desktop_TopRightSticky_300x250_Futhead', 'Desktop_TopRightSticky_300x600_Futhead'],
				},
				'03_PF': {
					sizes: [[300, 250]],
					ids: ['Desktop_Footer_300x250_Futhead'],
				},
				'06_FMR': {
					sizes: [[300, 250]],
					ids: ['Desktop_SecondRightSticky_300x250_Futhead'],
				},
			},
		},

		mobile: {
			enabled: false,
			publisherId: '156260',
			slots: {
				'01_LB': {
					sizes: [[320, 50]],
					ids: ['Mobile_Top_320x50_Futhead'],
				},
				'02_MR': {
					sizes: [[300, 250]],
					ids: ['Mobile_Incontent_First_300x250_Futhead'],
				},
				'03_PF': {
					sizes: [[300, 250]],
					ids: ['Mobile_Incontent_Second_300x250_Futhead'],
				},
				'06_FMR': {
					sizes: [[300, 250]],
					ids: ['Mobile_Footer_300x250_Futhead'],
				},
			},
		},
	};

	return context[device];
}
