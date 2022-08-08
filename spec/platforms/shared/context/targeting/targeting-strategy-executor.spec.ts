import {
	TargetingStrategies,
	TargetingStrategiesNames,
	TargetingStrategyExecutor,
} from '../../../../../platforms/shared/context/targeting/targeting-strategy-executor';
import { StrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/strategy-builder.mock';
import { expect } from 'chai';
import { TargetingStrategyPriorityService } from '../../../../../platforms/shared/context/targeting/targeting-strategies/services/targeting-strategy-priority-service';

const mockStrategies: TargetingStrategies = {
	[TargetingStrategiesNames.DEFAULT]: new StrategyBuilderMock({ test: 'default' }).build(),
	[TargetingStrategiesNames.SITE_CONTEXT]: new StrategyBuilderMock({ test: 'site' }).build(),
	[TargetingStrategiesNames.PAGE_CONTEXT]: new StrategyBuilderMock({ test: 'page' }).build(),
	[TargetingStrategiesNames.COMBINED]: new StrategyBuilderMock({ test: 'site' }).build(),
};

class TargetingStrategyPriorityServiceMock extends TargetingStrategyPriorityService {
	// @ts-ignore in this mock the constructor takes in what the pick pickQualifyingStrategy will return
	constructor(private returnsPriorityStrategy: TargetingStrategiesNames) {}

	pickQualifyingStrategy(): TargetingStrategiesNames {
		return this.returnsPriorityStrategy;
	}
}

/* eslint-disable @typescript-eslint/no-unused-vars */
function strategyListenerDummy(_) {}

describe('Targeting Strategy execution', () => {
	it('Pick default strategy', function () {
		const ps = new TargetingStrategyPriorityServiceMock(TargetingStrategiesNames.DEFAULT);
		const tse = new TargetingStrategyExecutor(mockStrategies, ps, strategyListenerDummy);
		const targeting = tse.execute();

		expect(targeting).to.eql({ test: 'default' });
	});

	it('Pick site context strategy', function () {
		const ps = new TargetingStrategyPriorityServiceMock(TargetingStrategiesNames.SITE_CONTEXT);
		const tse = new TargetingStrategyExecutor(mockStrategies, ps, strategyListenerDummy);
		const targeting = tse.execute();

		expect(targeting).to.eql({ test: 'site' });
	});

	it('Pick page context strategy', function () {
		const ps = new TargetingStrategyPriorityServiceMock(TargetingStrategiesNames.PAGE_CONTEXT);
		const tse = new TargetingStrategyExecutor(mockStrategies, ps, strategyListenerDummy);
		const targeting = tse.execute();

		expect(targeting).to.eql({ test: 'page' });
	});
});
