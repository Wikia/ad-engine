import { TargetingStrategyExecutor } from '../../../../../platforms/shared/context/targeting/targeting-strategy-executor';
import { DefaultStrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/default-strategy-builder.mock';
import { AnotherStrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/another-strategy-builder.mock';
import { expect } from 'chai';

describe('Targeting Factory', () => {
	const SKIN = 'skin';
	let tse: TargetingStrategyExecutor;

	beforeEach(() => {
		tse = new TargetingStrategyExecutor({
			default: new DefaultStrategyBuilderMock().build(SKIN),
			pageContext: new AnotherStrategyBuilderMock().build(SKIN),
		});
	});

	it('Pick an existing strategy - should work', function () {
		const targeting = tse.execute('default');

		expect(targeting).to.eql({ test: 'test' });
	});

	it('Pick an unknown strategy - should fall back to default', function () {
		const targeting = tse.execute('unknown');

		expect(targeting).to.eql({ test: 'test' });
	});

	it('Pick an page level context strategy - should work', function () {
		const targeting = tse.execute('pageContext');

		expect(targeting).to.eql({ test: 'another' });
	});
});
