import { TargetingObject, TargetingService, targetingService } from '@wikia/core';
import { AdSlot } from '@wikia/core/models/ad-slot';
import { context } from '@wikia/core/services/context-service';
import { slotService } from '@wikia/core/services/slot-service';
import { buildVastUrl, getCustomParameters } from '@wikia/core/utils/tagless-request-url-builder';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('tagless-request-url-builder', () => {
	let lisAdSlot;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;
	const targetingData = {
		s0: '000',
		uno: 'foo',
		due: 15,
		tre: ['bar', 'zero'],
		quattro: null,
	};

	beforeEach(() => {
		context.extend({
			adUnitId:
				'/{custom.dfpId}/{custom.serverPrefix}/{src}/{slotConfig.slotName}/{custom.wikiIdentifier}-{targeting.s0}',
			custom: {
				dfpId: '5441',
				serverPrefix: 'wka.fandom',
				wikiIdentifier: '_not_a_top1k_wiki',
			},
			src: 'test',
			vast: {
				adUnitId: '/{custom.dfpId}/{custom.serverPrefix}/{src}/{slotConfig.slotName}',
			},
			slots: {
				layout_initializer: {
					adProduct: 'layout_initializer',
					group: 'LIS',
					defaultSizes: [[32, 32]],
				},
				top_leaderboard: {},
			},
			options: {
				trackingOptIn: false,
			},
		});

		targetingServiceStub = global.sandbox.stub(targetingService);
		targetingServiceStub.dump.returns(targetingData);
		targetingServiceStub.extend.callsFake((newTargeting: TargetingObject) => {
			Object.assign(targetingData, newTargeting);
		});

		lisAdSlot = new AdSlot({ id: 'layout_initializer' });
		slotService.add(new AdSlot({ id: 'top_leaderboard' }));
		slotService.add(lisAdSlot);
	});

	it('build VAST URL with DFP domain', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/^https:\/\/pubads\.g\.doubleclick\.net\/gampad\/ads/g)).to.be.ok;
	});

	it('build VAST URL with required DFP parameters', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/output=xml_vast4&/g)).to.be.ok;
		expect(vastUrl.match(/&env=vp&/g)).to.be.ok;
		expect(vastUrl.match(/&gdfp_req=1&/g)).to.be.ok;
		expect(vastUrl.match(/&impl=s&/g)).to.be.ok;
		expect(vastUrl.match(/&unviewed_position_start=1&/g)).to.be.ok;
	});

	it('build VAST URL with configured ad unit', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&iu=\/5441\/wka\.fandom\/test\/top_leaderboard&/g)).to.be.ok;
	});

	it('build VAST URL with horizontal ad size', () => {
		const vastUrl = buildVastUrl(1.5, 'top_leaderboard');

		expect(vastUrl.match(/&sz=640x480&/g)).to.be.ok;
	});

	it('build VAST URL with referrer', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&url=about%3Ablank/g)).to.be.ok;
	});

	it('build VAST URL with description_url', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&description_url=about%3Ablank/g)).to.be.ok;
	});

	it('build VAST URL with numeric correlator', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&correlator=\d+&/g)).to.be.ok;
	});

	it('build VAST URL with page level targeting', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&cust_params=s0%3D000%26uno%3Dfoo%26due%3D15%26tre%3Dbar%2Czero/g)).to.be
			.ok;
	});

	it('build VAST URL with page and slotName level targeting', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		const custParams =
			/&cust_params=s0%3D000%26uno%3Dfoo%26due%3D15%26tre%3Dbar%2Czero%26src%3Dtest%26pos%3Dtop_leaderboard/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build VAST URL with restricted number of ads', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', { numberOfAds: 1 });

		const custParams = /&pmad=1/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build VAST URL with content source and video ids', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			contentSourceId: '123',
			videoId: 'abc',
		});

		const custParams = /&cmsid=123&vid=abc/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build VAST URL without content source and video ids when at least one is missing', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			contentSourceId: '123',
		});

		const custParams = /&cmsid=123/;

		expect(vastUrl.match(custParams)).to.not.be.ok;
	});

	it('build VAST URL without content source and video ids when at least one is missing', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			videoId: 'abc',
		});

		const custParams = /&vid=abc/;

		expect(vastUrl.match(custParams)).to.not.be.ok;
	});

	it('build VAST URL with preroll video position', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			vpos: 'preroll',
		});

		const custParams = /&vpos=preroll/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build VAST URL with midroll video position', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			vpos: 'midroll',
		});

		const custParams = /&vpos=midroll/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build VAST URL with postroll video position', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			vpos: 'postroll',
		});

		const custParams = /&vpos=postroll/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build VAST URL without video position', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			vpos: 'invalid',
		});

		const custParams = /&vpos=/;

		expect(vastUrl.match(custParams)).to.not.be.ok;
	});

	it('builds and returns custom params as encoded string', () => {
		const adSlot = slotService.get('top_leaderboard');
		const customParams = getCustomParameters(adSlot, null);
		expect(customParams).to.eq(
			's0%3D000%26uno%3Dfoo%26due%3D15%26tre%3Dbar%2Czero%26src%3Dtest%26pos%3Dtop_leaderboard%26rv%3D1',
		);
	});

	it('builds and returns custom params as a string', () => {
		const adSlot = slotService.get('top_leaderboard');
		const customParams = getCustomParameters(adSlot, null, false);
		expect(customParams).to.eq(
			's0=000&uno=foo&due=15&tre=bar,zero&src=test&pos=top_leaderboard&rv=1',
		);
	});
});
