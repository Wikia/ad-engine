import { TargetingStrategyExecutor } from '../../../../../platforms/shared/context/targeting/targeting-strategy-executor';
import { DefaultStrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/default-strategy-builder.mock';
import { AnotherStrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/another-strategy-builder.mock';
import { expect } from 'chai';

describe('Targeting Factory', () => {
	const SKIN = 'skin';
	let tse: TargetingStrategyExecutor;

	beforeEach(() => {
		tse = new TargetingStrategyExecutor();
		tse.strategyBuilders = {
			default: DefaultStrategyBuilderMock,
			pageContext: AnotherStrategyBuilderMock,
		};
	});

	it('Pick an existing strategy - should work', function () {
		const targeting = tse.execute('default', SKIN);

		expect(targeting).to.eql({ test: 'test' });
	});

	it('Pick an unknown strategy - should fall back to default', function () {
		const targeting = tse.execute('unknown', SKIN);

		expect(targeting).to.eql({ test: 'test' });
	});

	it('Pick an page level context strategy - should work', function () {
		const targeting = tse.execute('pageContext', SKIN);

		expect(targeting).to.eql({ test: 'another' });
	});
});
