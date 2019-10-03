import { DeviceMode } from '@platforms/shared';

export function getAppNexusContext(app: string, device: DeviceMode): any {
	const context = {
		muthead: {
			desktop: {
				enabled: false,
				slots: {
					'01_LB': {
						sizes: [[728, 90], [970, 250]],
						placementId: '16755870',
					},
					'02_MR': {
						sizes: [[300, 250], [300, 600]],
						placementId: '16755872',
					},
					'03_PF': {
						sizes: [[300, 250]],
						placementId: '16755874',
					},
					'04_BLB': {
						sizes: [[728, 90]],
						placementId: '16755876',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						placementId: '16755879',
					},
				},
			},

			mobile: {
				enabled: false,
				slots: {
					'01_LB': {
						sizes: [[320, 50]],
						placementId: '16755858',
					},
					'02_MR': {
						sizes: [[300, 250]],
						placementId: '16755860',
					},
					'03_PF': {
						sizes: [[300, 250]],
						placementId: '16755861',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						placementId: '16755866',
					},
				},
			},
		},

		futhead: {
			desktop: {
				enabled: false,
				slots: {
					'01_LB': {
						sizes: [[728, 90], [970, 250]],
						placementId: '16755892',
					},
					'02_MR': {
						sizes: [[300, 250], [300, 600]],
						placementId: '16755893',
					},
					'03_PF': {
						sizes: [[300, 250]],
						placementId: '16755894',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						placementId: '16755896',
					},
				},
			},

			mobile: {
				enabled: false,
				slots: {
					'01_LB': {
						sizes: [[320, 50]],
						placementId: '16755888',
					},
					'02_MR': {
						sizes: [[300, 250]],
						placementId: '16755889',
					},
					'03_PF': {
						sizes: [[300, 250]],
						placementId: '16755890',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						placementId: '16755891',
					},
				},
			},
		},
	};

	return context[app][device];
}
