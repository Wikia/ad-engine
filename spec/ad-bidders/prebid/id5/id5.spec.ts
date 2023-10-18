import { id5 } from '@wikia/ad-bidders/prebid/id5';
import { context, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { PbjsStub, stubPbjs } from '../../../core/services/pbjs.stub';

describe('Id5', () => {
	let pbjsStub: PbjsStub;

	const id5EnabledConfig = {
		name: 'id5Id',
		params: {
			partner: 1139,
			abTesting: {
				enabled: false,
				controlGroupPct: undefined,
			},
		},
		storage: {
			type: 'html5',
			name: 'id5id',
			expires: 90,
			refreshInSeconds: 8 * 3600,
		},
	};

	beforeEach(() => {
		context.set('bidders.prebid.id5', true);
		context.set('options.optOutSale', false);
		window.fandomContext.partners.directedAtChildren = false;

		pbjsStub = stubPbjs(global.sandbox).pbjsStub;
	});

	afterEach(() => {
		context.set('bidders.prebid.id5AbValue', undefined);
		global.sandbox.restore();
	});

	after(() => {
		window.fandomContext.partners.directedAtChildren = undefined;
	});

	it('Id5 is enabled', () => {
		expect(id5.getConfig()).to.eql(id5EnabledConfig);
	});

	it('Id5 is disabled by feature flag', () => {
		context.set('bidders.prebid.id5', false);

		expect(id5.getConfig()).to.eql(undefined);
	});

	it('Id5 is disabled on child-directed wiki', () => {
		window.fandomContext.partners.directedAtChildren = true;

		expect(id5.getConfig()).to.eql(undefined);
	});

	it('Id5 A/B testing is disabled when no value is set in context', () => {
		expect(id5.getConfig().params.abTesting.enabled).to.eql(false);
	});

	it('Id5 A/B testing value is set with the one taken from context', () => {
		context.set('bidders.prebid.id5AbValue', 0.9);

		expect(id5.getConfig().params.abTesting.controlGroupPct).to.eql(0.9);
	});

	describe('setupAbTesting', () => {
		it('should not set targeting parameter if control group is not found', () => {
			const targetingServiceStub = global.sandbox.stub(targetingService, 'set');

			id5.setupAbTesting(pbjsStub);

			expect(targetingServiceStub.called).to.eql(false);
		});

		it('should set targeting parameter to "U" if control group is undefined', async () => {
			const targetingServiceStub = global.sandbox.stub(targetingService, 'set');
			pbjsStub.getUserIds.returns({
				id5id: { id: '1234567890abcdef', ext: { abTestingControlGroup: undefined } },
			});

			await id5.setupAbTesting(pbjsStub);

			expect(targetingServiceStub.calledOnceWithExactly('id5_group', 'U')).to.be.true;
		});

		it('should set targeting parameter to "A" if control group is "true"', async () => {
			const targetingServiceStub = global.sandbox.stub(targetingService, 'set');
			pbjsStub.getUserIds.returns({
				id5id: { id: '1234567890abcdef', ext: { abTestingControlGroup: true } },
			});

			await id5.setupAbTesting(pbjsStub);

			expect(targetingServiceStub.calledOnceWithExactly('id5_group', 'A')).to.be.true;
		});

		it('should set targeting parameter to "B" if control group is "false"', async () => {
			const targetingServiceStub = global.sandbox.stub(targetingService, 'set');
			pbjsStub.getUserIds.returns({
				id5id: { id: '1234567890abcdef', ext: { abTestingControlGroup: false } },
			});

			await id5.setupAbTesting(pbjsStub);

			expect(targetingServiceStub.calledOnceWithExactly('id5_group', 'B')).to.be.true;
		});
	});
});
