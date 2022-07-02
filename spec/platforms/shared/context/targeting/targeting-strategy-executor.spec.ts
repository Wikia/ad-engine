import {
	DEFAULT_TARGETING_STRATEGY,
	PAGE_CONTEXT_STRATEGY,
	SITE_CONTEXT_STRATEGY,
	TargetingStrategies,
	TargetingStrategiesNames,
	TargetingStrategyExecutor,
} from '../../../../../platforms/shared/context/targeting/targeting-strategy-executor';
import { StrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/strategy-builder.mock';
import { expect } from 'chai';
import {
	DEFAULT_PRIORITY_STRATEGY,
	TargetingStrategyPriorityService,
} from '../../../../../platforms/shared/context/targeting/targeting-strategies/services/targeting-strategy-priority-service';

const mockStrategies: TargetingStrategies = {
	[DEFAULT_TARGETING_STRATEGY]: new StrategyBuilderMock({ test: 'default' }).build(),
	[SITE_CONTEXT_STRATEGY]: new StrategyBuilderMock({ test: 'site' }).build(),
	[PAGE_CONTEXT_STRATEGY]: new StrategyBuilderMock({ test: 'page' }).build(),
};

class TargetingStrategyPriorityServiceMock extends TargetingStrategyPriorityService {
	// @ts-ignore in this mock the constructor takes in what the pick pickQualifyingStrategy will return
	constructor(private priorityStrategy: TargetingStrategiesNames) {}

	pickQualifyingStrategy(): TargetingStrategiesNames {
		return this.priorityStrategy;
	}
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function strategyListenerDummy(_) {}

describe('Targeting Strategy execution', () => {
	it('Pick default strategy', function () {
		const ps = new TargetingStrategyPriorityServiceMock(DEFAULT_PRIORITY_STRATEGY);
		const tse = new TargetingStrategyExecutor(mockStrategies, ps, strategyListenerDummy);
		const targeting = tse.execute();

		expect(targeting).to.eql({ test: 'default' });
	});

	it('Pick site context strategy', function () {
		const ps = new TargetingStrategyPriorityServiceMock(SITE_CONTEXT_STRATEGY);
		const tse = new TargetingStrategyExecutor(mockStrategies, ps, strategyListenerDummy);
		const targeting = tse.execute();

		expect(targeting).to.eql({ test: 'site' });
	});

	it('Pick page context strategy', function () {
		const ps = new TargetingStrategyPriorityServiceMock(PAGE_CONTEXT_STRATEGY);
		const tse = new TargetingStrategyExecutor(mockStrategies, ps, strategyListenerDummy);
		const targeting = tse.execute();

		expect(targeting).to.eql({ test: 'page' });
	});
});
