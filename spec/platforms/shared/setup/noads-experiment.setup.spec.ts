import sinon, { assert } from 'sinon';
import {
	blockUAP,
	getUnitNameToDisable,
	NoAdsExperimentSetup,
} from '../../../../platforms/shared/setup/noads-experiment.setup';
import { assert as chaiAssert } from 'chai';
import { slotsContext } from '../../../../platforms/shared';

describe('NoAdsExperimentSetup', () => {
	const instantConfig = {
		get: () => [],
	} as any;

	const cookieAdapter = {
		getItem: () => '',
	} as any;

	const sandbox = sinon.createSandbox();

	const configSpy = sandbox.spy(instantConfig, 'get');
	const cookieSpy = sandbox.spy(cookieAdapter, 'getItem');

	afterEach(function() {
		sandbox.restore();
	});

	it('should use correct cookie and ICBM variable', () => {
		const experimentSetup = new NoAdsExperimentSetup(instantConfig, cookieAdapter);

		experimentSetup.execute();

		assert.calledOnce(configSpy.withArgs('icNoAdsExperimentConfig', []));
		assert.calledOnce(cookieSpy.withArgs('wikia_beacon_id'));
	});

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

		chaiAssert(unitNameToDisable === 'correct');
	});

	it('should remove UAP sizes from top_leaderboard slotContext', () => {
		const slotsContextSub = sandbox.stub(slotsContext, 'removeSlotSize');

		blockUAP();

		assert.calledOnce(slotsContextSub.withArgs('top_leaderboard', [3, 3]));
		assert.calledOnce(slotsContextSub.withArgs('top_leaderboard', [2, 2]));
	});
});
