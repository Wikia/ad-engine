import {
	DEFAULT_STRATEGY,
	TargetingStrategyExecutor,
} from '../../../../../platforms/shared/context/targeting/targeting-strategy-executor';
import { DefaultStrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/default-strategy-builder.mock';
import { AnotherStrategyBuilderMock } from '../test_doubles/targeting-strategies/builders/another-strategy-builder.mock';
import { expect } from 'chai';
import sinon from 'sinon';

const SKIN = 'skin';

const mockStrategies = {
	[DEFAULT_STRATEGY]: new DefaultStrategyBuilderMock().build(SKIN),
	pageContext: new AnotherStrategyBuilderMock().build(SKIN),
};

describe('Targeting pages without Site Level Tags', () => {
	let tse: TargetingStrategyExecutor;
	let loggerSpy;

	beforeEach(() => {
		const sampleSiteTags = {};
		loggerSpy = sinon.spy();
		tse = new TargetingStrategyExecutor(mockStrategies, sampleSiteTags, loggerSpy);
	});

	it('Pick an existing strategy - should work', function () {
		const targeting = tse.execute('default');

		expect(targeting).to.eql({ test: 'test' });
		sinon.assert.notCalled(loggerSpy);
	});

	it('Pick an unknown strategy - should fall back to default', function () {
		const targeting = tse.execute('unknown');

		expect(targeting).to.eql({ test: 'test' });
		sinon.assert.calledOnce(loggerSpy);
	});

	it('Pick a page level context strategy - should fall back to default because we have Site / Community Tags', function () {
		const targeting = tse.execute('pageContext');

		expect(targeting).to.eql({ test: 'another' });
		sinon.assert.notCalled(loggerSpy);
	});
});

describe('Targeting pages with Site Level Tags', () => {
	let tse: TargetingStrategyExecutor;
	let loggerSpy;

	beforeEach(() => {
		const sampleSiteTags = { some: 'tag' };
		loggerSpy = sinon.spy();
		tse = new TargetingStrategyExecutor(mockStrategies, sampleSiteTags, loggerSpy);
	});

	it('Pick an existing strategy - should fallback to default because there are not page level tags', function () {
		const targeting = tse.execute('default');

		expect(targeting).to.eql({ test: 'test' });
		sinon.assert.notCalled(loggerSpy);
	});
});
