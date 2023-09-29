import { context } from '@wikia/index';
import { slotsContext } from '@wikia/platforms/shared';
import {
	blockUAP,
	getUnitNameToDisable,
	NoAdsExperimentSetup,
} from '@wikia/platforms/shared/setup/noads-experiment.setup';
import { expect } from 'chai';
import { assert } from 'sinon';

describe('NoAdsExperimentSetup', () => {
	const instantConfig = {
		get: () => [],
	} as any;

	const cookieAdapter = {
		getItem: () => '',
	} as any;

	let configGetSpy;
	let cookieGetSpy;

	beforeEach(function () {
		configGetSpy = global.sandbox.spy(instantConfig, 'get');
		cookieGetSpy = global.sandbox.spy(cookieAdapter, 'getItem');
	});

	afterEach(function () {
		context.remove('state.noAdsExperiment.unitName');
	});

	it('should use correct cookie and ICBM variable', () => {
		const experimentSetup = new NoAdsExperimentSetup(instantConfig, cookieAdapter);

		experimentSetup.execute();

		assert.calledOnce(configGetSpy.withArgs('icNoAdsExperimentConfig', []));
		assert.calledOnce(cookieGetSpy.withArgs('wikia_beacon_id'));
	});

	it('should remove UAP sizes from top_leaderboard slotContext', () => {
		const slotsContextSub = global.sandbox.stub(slotsContext, 'removeSlotSize');

		blockUAP(true);
		assert.calledOnce(slotsContextSub.withArgs('top_leaderboard', [2, 2]));

		blockUAP(false);
		assert.calledOnce(slotsContextSub.withArgs('top_leaderboard', [3, 3]));
	});

	it('should set blocked ad unit in the context', () => {
		const experimentSetup = new NoAdsExperimentSetup(instantConfig, cookieAdapter);
		const mockedAdUnit = 'block_me';

		experimentSetup.disableUnit(mockedAdUnit);

		expect(context.get('state.noAdsExperiment.unitName')).to.equal(mockedAdUnit);
	});

	it('should not set blocked ad unit in the context when it is empty', () => {
		const experimentSetup = new NoAdsExperimentSetup(instantConfig, cookieAdapter);
		experimentSetup.disableUnit();

		expect(context.get('state.noAdsExperiment.unitName')).to.equal(undefined);
	});

	describe('getUnitNameToDisable', () => {
		it('should pick correct unit to disable', () => {
			const configs = [
				{
					unitName: 'wrong',
					beaconRegex: '^123',
				},
				{
					unitName: 'correct',
					beaconRegex: '^abc',
				},
				{
					unitName: 'wrong_again',
					beaconRegex: '^.',
				},
			];
			const beacon = 'abc123';

			const unitNameToDisable = getUnitNameToDisable(configs, beacon);

			expect(unitNameToDisable).to.equal('correct');
		});

		it('should not return anything when there is no beacon', () => {
			const configs = [
				{
					unitName: 'correct',
					beaconRegex: '^abc',
				},
			];
			const beacon = undefined;

			const unitNameToDisable = getUnitNameToDisable(configs, beacon);

			expect(unitNameToDisable).to.equal(undefined);
		});

		it('should not return anything when there is no config', () => {
			const configs = [];
			const beacon = '123';

			const unitNameToDisable = getUnitNameToDisable(configs, beacon);

			expect(unitNameToDisable).to.equal(undefined);
		});
	});
});