import { BaseSlotConfig, context, Dictionary, InstantConfigService } from '@wikia/core';
import { SlotsConfigurationExtender } from '@wikia/platforms/shared/setup/slots-config-extender';
import { expect } from 'chai';

function mockSlotConfig(slotsConfig: Dictionary<BaseSlotConfig>): InstantConfigService {
	return {
		get: (key) => {
			if (key === 'icSlotsConfig') return slotsConfig;
		},
	} as InstantConfigService;
}

describe('SlotsConfigurationExtender', () => {
	afterEach(() => {
		context.remove('slots');
	});

	it('should not change slots if extension does not match', () => {
		// given
		const slots: Dictionary<BaseSlotConfig> = {
			slot1: {
				defaultSizes: [
					[1, 1],
					[100, 100],
				],
			},
			slot2: {
				defaultSizes: [
					[2, 2],
					[200, 200],
				],
			},
		};
		context.set('slots', slots);

		// when
		new SlotsConfigurationExtender(
			mockSlotConfig({
				slots3: {
					defaultSizes: [
						[3, 3],
						[300, 300],
					],
				},
			}),
		).execute();

		// then
		expect(context.get('slots')).to.equal(slots);
	});

	it('should extend sizes', () => {
		// given
		const slots: Dictionary<BaseSlotConfig> = {
			slot1: {
				defaultSizes: [
					[1, 1],
					[100, 100],
				],
			},
			slot2: {
				defaultSizes: [
					[2, 2],
					[200, 200],
				],
			},
			slot3: {
				targeting: {},
			},
		};
		context.set('slots', slots);

		// when
		new SlotsConfigurationExtender(
			mockSlotConfig({
				slot1: {
					defaultSizes: [
						[1, 1],
						[3, 3],
					],
				},
				slot3: {
					defaultSizes: [[3, 3]],
				},
			}),
		).execute();

		// then
		expect(context.get('slots')).to.deep.equal({
			slot1: {
				defaultSizes: [
					[1, 1],
					[100, 100],
					[3, 3],
				],
			},
			slot2: {
				defaultSizes: [
					[2, 2],
					[200, 200],
				],
			},
			slot3: {
				defaultSizes: [[3, 3]],
				targeting: {},
			},
		});
	});

	it('should merge targeting', () => {
		// given
		const slots: Dictionary<BaseSlotConfig> = {
			slot1: {
				targeting: {
					s0: 'ent',
				},
			},
			slot2: {
				targeting: {
					s0: 'ent',
					genre: 'gaming',
				},
			},
			slot3: {},
		};
		context.set('slots', slots);

		// when
		new SlotsConfigurationExtender(
			mockSlotConfig({
				slot1: {
					targeting: {
						genre: 'enter',
					},
				},
				slot2: {
					targeting: {
						s0: 'game',
					},
				},
				slot3: {
					targeting: {
						s0: 'other',
					},
				},
			}),
		).execute();

		// then
		expect(context.get('slots')).to.deep.equal({
			slot1: {
				targeting: {
					s0: 'ent',
					genre: 'enter',
				},
			},
			slot2: {
				targeting: {
					s0: 'game',
					genre: 'gaming',
				},
			},
			slot3: {
				targeting: {
					s0: 'other',
				},
			},
		});
	});
});
