import { id5 } from '@wikia/ad-bidders/prebid/id5';
import { context } from '@wikia/core';
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

	it('Id5 is disabled if user has opted out sale', () => {
		context.set('options.optOutSale', true);

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

	describe('getControlGroup', () => {
		it('returns B when user is in the control group', async () => {
			pbjsStub.getUserIds.returns({
				id5id: { ext: { abTestingControlGroup: true } },
			});

			const controlGroup = await id5.getControlGroup(pbjsStub);

			expect(controlGroup).to.eql('B');
		});

		it('returns A when user is not in the control group', async () => {
			pbjsStub.getUserIds.returns({
				id5id: { ext: { abTestingControlGroup: false } },
			});

			const controlGroup = await id5.getControlGroup(pbjsStub);

			expect(controlGroup).to.eql('A');
		});
	});
});
