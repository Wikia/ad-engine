import { StrategyBuilder } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/interfaces/strategy-builder';
import { TargetingStrategy } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/interfaces/targeting-strategy';
import { makeDefaultStrategySpy } from '../strategies/defautl-strategy.spy';

export class DefaultStrategyBuilderMock implements StrategyBuilder {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	build(skin: string): TargetingStrategy {
		return makeDefaultStrategySpy();
	}
}
