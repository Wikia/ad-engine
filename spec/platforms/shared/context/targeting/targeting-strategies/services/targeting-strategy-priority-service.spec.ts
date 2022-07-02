import {
	DEFAULT_TARGETING_STRATEGY,
	PAGE_CONTEXT_STRATEGY,
	SITE_CONTEXT_STRATEGY,
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
import { SiteTagsOnlyPriority } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/priorities-strategies/site-tags-only-priority';
import { SiteTagsFirstPriority } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/priorities-strategies/site-tags-first-priority';
import { PageTagsFirstPriority } from '../../../../../../../platforms/shared/context/targeting/targeting-strategies/priorities-strategies/page-tags-first-priority';

const MOCK_PRIORITY_STRATEGY = 'mockPriorityStrategy';

class MockPriority implements PriorityStrategy {
	execute(): TargetingStrategiesNames {
		return 'siteContext';
	}
}

const mockStrategies: PriorityStrategies = {
	[DEFAULT_PRIORITY_STRATEGY]: new DefaultOnlyPriority(),
	[MOCK_PRIORITY_STRATEGY]: new MockPriority(),
	siteTagsOnly: new SiteTagsOnlyPriority(),
	siteTagsFirst_withSiteTags: new SiteTagsFirstPriority({ test: 'site tag' }),
	siteTagsFirst_withoutSiteTags: new SiteTagsFirstPriority({}),
	pageTagsFirst_withPageTags: new PageTagsFirstPriority({ test: 'page tag' }),
	pageTagsFirst_withoutPageTags: new PageTagsFirstPriority({}),
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

	it('Pick siteTagsFirst strategy with Site Tags - should work and use site tags', function () {
		const tsps = new TargetingStrategyPriorityService(
			mockStrategies,
			'siteTagsFirst_withSiteTags',
			loggerSpy,
		);
		const strategy = tsps.pickQualifyingStrategy();

		expect(strategy).to.eql(SITE_CONTEXT_STRATEGY);
		sinon.assert.notCalled(loggerSpy);
	});

	it('Pick siteTagsFirst strategy without Site Tags - should switch to page tags', function () {
		const tsps = new TargetingStrategyPriorityService(
			mockStrategies,
			'siteTagsFirst_withoutSiteTags',
			loggerSpy,
		);
		const strategy = tsps.pickQualifyingStrategy();

		expect(strategy).to.eql(PAGE_CONTEXT_STRATEGY);
		sinon.assert.notCalled(loggerSpy);
	});

	it('Pick pageTagsFirst strategy with Page Tags - should use page tags', function () {
		const tsps = new TargetingStrategyPriorityService(
			mockStrategies,
			'pageTagsFirst_withPageTags',
			loggerSpy,
		);
		const strategy = tsps.pickQualifyingStrategy();

		expect(strategy).to.eql(PAGE_CONTEXT_STRATEGY);
		sinon.assert.notCalled(loggerSpy);
	});

	it('Pick pageTagsFirst strategy without Page Tags - should switch to site tags', function () {
		const tsps = new TargetingStrategyPriorityService(
			mockStrategies,
			'pageTagsFirst_withoutPageTags',
			loggerSpy,
		);
		const strategy = tsps.pickQualifyingStrategy();

		expect(strategy).to.eql(SITE_CONTEXT_STRATEGY);
		sinon.assert.notCalled(loggerSpy);
	});
});
