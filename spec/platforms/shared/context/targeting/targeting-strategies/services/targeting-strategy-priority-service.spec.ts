import {
	DEFAULT_TARGETING_STRATEGY,
	TargetingStrategiesNames,
} from '../../../../../../../platforms/shared/context/targeting/targeting-strategy-executor';
import { expect } from 'chai';
import sinon from 'sinon';
import {
	DEFAULT_PRIORITY_STRATEGY,
	PriorityStrategies,
	TargetingStrategyPriorityService,
} from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/services/targeting-strategy-priority-service';
import { DefaultOnlyPriority } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/priorities-strategies/default-only-priority';
import { PriorityStrategy } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/interfaces/priority-strategy';

const MOCK_PRIORITY_STRATEGY = 'mockPriorityStrategy';

class MockPriority implements PriorityStrategy {
	execute(): TargetingStrategiesNames {
		return 'siteContext';
	}
}

const mockStrategies: PriorityStrategies = {
	[DEFAULT_PRIORITY_STRATEGY]: new DefaultOnlyPriority(),
	[MOCK_PRIORITY_STRATEGY]: new MockPriority(),
};

describe('Pick targeting priority', () => {
	let loggerSpy;

	beforeEach(() => {
		loggerSpy = sinon.spy();
	});

	it('Pick an existing strategy - should work', function () {
		const tsps = new TargetingStrategyPriorityService(
			mockStrategies,
			DEFAULT_PRIORITY_STRATEGY,
			loggerSpy,
		);
		const strategy = tsps.pickQualifyingStrategy();

		expect(strategy).to.eql(DEFAULT_TARGETING_STRATEGY);
		sinon.assert.notCalled(loggerSpy);
	});

	it('Pick an unknown strategy - should fall back to default', function () {
		const tsps = new TargetingStrategyPriorityService(mockStrategies, 'unknown', loggerSpy);
		const strategy = tsps.pickQualifyingStrategy();

		expect(strategy).to.eql(DEFAULT_TARGETING_STRATEGY);
		sinon.assert.calledOnce(loggerSpy);
	});

	it('Pick another known context strategy - should work and use selected strategy', function () {
		const tsps = new TargetingStrategyPriorityService(
			mockStrategies,
			MOCK_PRIORITY_STRATEGY,
			loggerSpy,
		);
		const strategy = tsps.pickQualifyingStrategy();

		expect(strategy).to.eql('siteContext');
		sinon.assert.notCalled(loggerSpy);
	});
});
