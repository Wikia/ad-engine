import { DeviceMode } from '@platforms/shared';

export function getOpenXContext(app: string, device: DeviceMode): any {
	const context = {
		muthead: {
			desktop: {
				enabled: false,
				delDomain: 'wikia-d.openx.net',
				slots: {
					'01_LB': {
						sizes: [[728, 90], [970, 250]],
						unit: '540835239',
					},
					'02_MR': {
						sizes: [[300, 250], [300, 600]],
						unit: '540835242',
					},
					'03_PF': {
						sizes: [[300, 250]],
						unit: '540835245',
					},
					'04_BLB': {
						sizes: [[728, 90]],
						unit: '540835248',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						unit: '540835232',
					},
				},
			},

			mobile: {
				enabled: false,
				delDomain: 'wikia-d.openx.net',
				slots: {
					'01_LB': {
						sizes: [[320, 50]],
						unit: '540835227',
					},
					'02_MR': {
						sizes: [[300, 250]],
						unit: '540835228',
					},
					'03_PF': {
						sizes: [[300, 250]],
						unit: '540835229',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						unit: '540835233',
					},
				},
			},
		},

		futhead: {
			desktop: {
				enabled: false,
				delDomain: 'wikia-d.openx.net',
				slots: {
					'01_LB': {
						sizes: [[728, 90], [970, 250]],
						unit: '540835240',
					},
					'02_MR': {
						sizes: [[300, 250], [300, 600]],
						unit: '540835244',
					},
					'03_PF': {
						sizes: [[300, 250]],
						unit: '540835246',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						unit: '540835249',
					},
				},
			},

			mobile: {
				enabled: false,
				delDomain: 'wikia-d.openx.net',
				slots: {
					'01_LB': {
						sizes: [[320, 50]],
						unit: '540835252',
					},
					'02_MR': {
						sizes: [[300, 250]],
						unit: '540835254',
					},
					'03_PF': {
						sizes: [[300, 250]],
						unit: '540835234',
					},
					'06_FMR': {
						sizes: [[300, 250]],
						unit: '540835237',
					},
				},
			},
		},
	};

	return context[app][device];
}
