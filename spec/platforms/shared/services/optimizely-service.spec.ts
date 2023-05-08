import { targetingService, TargetingService, utils } from '@wikia/core';
import { OptimizelyService } from '@wikia/platforms/shared';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('Optimizely service', () => {
	let optimizelyService: OptimizelyService;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		optimizelyService = new OptimizelyService();
		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	it('Not defined value', () => {
		const experiment = {
			EXPERIMENT_ENABLED: 'not_defined',
			EXPERIMENT_VARIANT: 'not_defined_variant',
		};

		expect(optimizelyService.getVariant(experiment)).to.equal(undefined);
	});

	it('Defined value, disabled experiment', () => {
		const experiment = {
			EXPERIMENT_ENABLED: 'experiment_xyz',
			EXPERIMENT_VARIANT: 'experiment_xyz_variant',
		};

		window.adsExperiments['experiment_xyz'] = false;
		window.adsExperiments['experiment_xyz_variant'] = 'A';

		expect(optimizelyService.getVariant(experiment)).to.equal(undefined);
	});

	it('Defined value, enabled experiment', () => {
		const experiment = {
			EXPERIMENT_ENABLED: 'experiment_xyz',
			EXPERIMENT_VARIANT: 'experiment_xyz_variant',
		};

		window.adsExperiments['experiment_xyz'] = true;
		window.adsExperiments['experiment_xyz_variant'] = 'A';

		expect(optimizelyService.getVariant(experiment)).to.equal('A');
	});

	it('Forced value', () => {
		const experiment = {
			EXPERIMENT_ENABLED: 'experiment_forced_xyz',
			EXPERIMENT_VARIANT: 'experiment_xyz_forced_variant',
		};

		global.sandbox
			.stub(utils.queryString, 'get')
			.withArgs('optimizely_experiment_xyz_forced_variant')
			.returns('B');

		expect(optimizelyService.getVariant(experiment)).to.equal('B');
	});

	it('Add variant to targeting', () => {
		const experiment = {
			EXPERIMENT_ENABLED: 'experiment_xyz',
			EXPERIMENT_VARIANT: 'experiment_xyz_variant',
		};

		optimizelyService.addVariantToTargeting(experiment, 'test');

		expect(targetingServiceStub.set.calledWith('optimizely', ['test'])).to.equal(true);
	});

	it('Add multiple variants to targeting', () => {
		const experiment = {
			EXPERIMENT_ENABLED: 'experiment_xyz',
			EXPERIMENT_VARIANT: 'experiment_xyz_variant',
		};

		const secondExperiment = {
			EXPERIMENT_ENABLED: 'second_experiment_xyz',
			EXPERIMENT_VARIANT: 'second_experiment_xyz_variant',
		};

		optimizelyService.addVariantToTargeting(experiment, 'firstV');
		expect(targetingServiceStub.set.calledWith('optimizely', ['firstV'])).to.equal(true);

		optimizelyService.addVariantToTargeting(secondExperiment, 'secondV');
		expect(targetingServiceStub.set.calledWith('optimizely', ['firstV', 'secondV'])).to.equal(true);
	});
});
