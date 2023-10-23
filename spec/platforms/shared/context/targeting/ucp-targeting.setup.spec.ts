import { InstantConfigService, targetingService } from '@wikia/core';
import { UcpTargetingSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';

let instantConfigStub;

beforeEach(() => {
	instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
});

afterEach(() => {
	delete window.optimizely;
	targetingService.clear();
});

describe('UCPTargetingSetup', () => {
	it('adds optimizely experiments to targeting', () => {
		window.optimizely = {
			get: () => ({
				getVariationMap: () => ({
					'123456789': {
						id: '234567890',
						name: 'test',
					},
				}),
			}),
		};
		const ucpTargetingSetup = new UcpTargetingSetup(instantConfigStub);
		ucpTargetingSetup.execute();

		expect(targetingService.get('optimizely')).to.eql(['123456789_234567890']);
	});

	it('adds all optimizely experiments to targeting', () => {
		window.optimizely = {
			get: () => ({
				getVariationMap: () => ({
					'123456789': {
						id: '234567890',
						name: 'test',
					},
					'987654321': {
						id: '876543210',
						name: 'test2',
					},
				}),
			}),
		};

		const ucpTargetingSetup = new UcpTargetingSetup(instantConfigStub);
		ucpTargetingSetup.execute();

		expect(targetingService.get('optimizely')).to.eql([
			'123456789_234567890',
			'987654321_876543210',
		]);
	});

	it('do not add optimizely experiments to targeting when optimizely is not loaded', () => {
		const ucpTargetingSetup = new UcpTargetingSetup(instantConfigStub);
		ucpTargetingSetup.execute();

		expect(targetingService.get('optimizely')).to.be.undefined;
	});

	it('do not add optimizely experiments to targeting when optimizely is loaded but getVariationMap return empty object', () => {
		window.optimizely = {
			get: () => ({
				getVariationMap: () => ({}),
			}),
		};
		const ucpTargetingSetup = new UcpTargetingSetup(instantConfigStub);
		ucpTargetingSetup.execute();

		expect(targetingService.get('optimizely')).to.be.undefined;
	});
});
