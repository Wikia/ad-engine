import { TargetingStrategyExecutor } from '../../../../../platforms/shared/context/targeting/targeting-strategy-executor';
import { DefaultStrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/default-strategy-builder.mock';

describe('Targeting Factory', () => {
	const SKIN = 'skin';
	let tse: TargetingStrategyExecutor;

	beforeEach(() => {
		tse = new TargetingStrategyExecutor();
		tse.strategyBuilders = { default: DefaultStrategyBuilderMock };
	});

	it('should work', function () {
		tse.execute('default', SKIN);
	});

	it('Unknown strategy falls back to default', function () {
		tse.execute('unknown', SKIN);
	});
});
