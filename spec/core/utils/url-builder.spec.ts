// @ts-strict-ignore
import { TargetingObject, TargetingService, targetingService } from '@wikia/core';
import { AdSlot } from '@wikia/core/models/ad-slot';
import { context } from '@wikia/core/services/context-service';
import { slotService } from '@wikia/core/services/slot-service';
import { buildVastUrl, getCustomParameters } from '@wikia/core/utils/url-builder';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('tagless-request-url-builder', () => {
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
				top_leaderboard: {},
			},
			options: {
				trackingOptIn: false,
			},
		});
		global.window.__tcfapi =
			global.window.__tcfapi || (function () {} as typeof global.window.__tcfapi);
		global.sandbox.stub(window, '__tcfapi').callsFake((cmd, version, cb) => {
			const mockedConsentData = {
				tcString: 'fakeConsentString',
			} as TCData;

			cb(mockedConsentData);
		});

		global.window.__uspapi =
			global.window.__uspapi || (function () {} as typeof global.window.__uspapi);
		global.sandbox.stub(window, '__uspapi').callsFake((cmd, param, cb) => {
			const mockedConsentData = {
				uspString: 'fakeConsentString',
			} as SignalData;

			cb(mockedConsentData, true);
		});

		targetingServiceStub = global.sandbox.stub(targetingService);
		targetingServiceStub.dump.returns(targetingData);
		targetingServiceStub.extend.callsFake((newTargeting: TargetingObject) => {
			Object.assign(targetingData, newTargeting);
		});

		slotService.add(new AdSlot({ id: 'top_leaderboard' }));
	});

	afterEach(() => {
		context.remove('options.geoRequiresConsent');
		context.remove('options.geoRequiresSignal');
		global.sandbox.restore();
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

	it('build VAST URL with tagless query-string parameter', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			isTagless: true,
		});

		const taglessPattern = /&tagless=1/;

		expect(vastUrl.match(taglessPattern)).to.be.ok;
	});

	it('build VAST URL with gdpr_consent query-string parameter when tagless is set in GDPR country', () => {
		context.set('options.geoRequiresConsent', true);
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			isTagless: true,
			gdpr_consent: 'GDPR_123_XYZ',
		});

		const gdprPattern = /&gdpr=1/;
		const gdprConsentPattern = /&gdpr_consent=/;

		expect(vastUrl.match(gdprPattern), 'VAST URL does not contain gdpr flag set to 1').to.be.ok;
		expect(vastUrl.match(gdprConsentPattern), 'VAST URL does not contain gdpr_consent').to.be.ok;
	});

	it('build VAST URL with us_privacy query-string parameter when tagless is set in CCPA country', () => {
		context.set('options.geoRequiresConsent', false);
		context.set('options.geoRequiresSignal', true);
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			isTagless: true,
			us_privacy: '!!!!',
		});

		const gdprPattern = /&gdpr=0/;
		const ccpaConsentPattern = /&us_privacy=/;

		expect(vastUrl.match(gdprPattern), 'VAST URL does not contain gdpr flag set to 0').to.be.ok;
		expect(vastUrl.match(ccpaConsentPattern)).to.be.ok;
	});

	it('build VAST URL with gdpr query-string parameter when tagless is set in other country than CCPA or GDPR', () => {
		context.set('options.geoRequiresConsent', false);
		context.set('options.geoRequiresSignal', false);
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			isTagless: true,
		});

		const gdprPattern = /&gdpr=0/;
		const gdprConsentPattern = /&gdpr_consent=/;
		const ccpaConsentPattern = /&us_privacy=/;

		expect(vastUrl.match(gdprPattern), 'VAST URL does not contain gdpr flag set to 0').to.be.ok;
		expect(vastUrl.match(gdprConsentPattern)).not.to.be.ok;
		expect(vastUrl.match(ccpaConsentPattern)).not.to.be.ok;
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
