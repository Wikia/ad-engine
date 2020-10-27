import { expect } from 'chai';
import { AdSlot } from '../../../src/ad-engine/models/ad-slot';
import { context } from '../../../src/ad-engine/services/context-service';
import { slotService } from '../../../src/ad-engine/services/slot-service';
import { buildVastUrl } from '../../../src/ad-engine/video/vast-url-builder';

describe('vast-url-builder', () => {
	beforeEach(() => {
		context.extend({
			src: 'test',
			vast: {
				adUnitId: '/5441/wka.fandom/{src}/{slotConfig.slotName}',
			},
			slots: {
				top_leaderboard: {},
			},
			targeting: {
				uno: 'foo',
				due: 15,
				tre: ['bar', 'zero'],
				quattro: null,
				wsi: 'xxxx',
			},
			options: {
				trackingOptIn: false,
			},
		});
		slotService.add(new AdSlot({ id: 'top_leaderboard' }));
	});

	it('build URL with DFP domain', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/^https:\/\/pubads\.g\.doubleclick\.net\/gampad\/ads/g)).to.be.ok;
	});

	it('build URL with required DFP parameters', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/output=vast&/g)).to.be.ok;
		expect(vastUrl.match(/&env=vp&/g)).to.be.ok;
		expect(vastUrl.match(/&gdfp_req=1&/g)).to.be.ok;
		expect(vastUrl.match(/&impl=s&/g)).to.be.ok;
		expect(vastUrl.match(/&unviewed_position_start=1&/g)).to.be.ok;
	});

	it('build URL with configured ad unit', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&iu=\/5441\/wka\.fandom\/test\/top_leaderboard&/g)).to.be.ok;
	});

	it('build URL with horizontal ad size', () => {
		const vastUrl = buildVastUrl(1.5, 'top_leaderboard');

		expect(vastUrl.match(/&sz=640x480&/g)).to.be.ok;
	});

	it('build URL with referrer', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&url=about%3Ablank/g)).to.be.ok;
	});

	it('build URL with description_url', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&description_url=about%3Ablank/g)).to.be.ok;
	});

	it('build URL with numeric correlator', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&correlator=\d+&/g)).to.be.ok;
	});

	it('build URL with page level targeting anp default wsi param', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		expect(vastUrl.match(/&cust_params=uno%3Dfoo%26due%3D15%26tre%3Dbar%2Czero%26wsi%3Dxxxx/g)).to
			.be.ok;
	});

	it('build URL with page, slotName level targeting and default wsi param', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard');

		// tslint:disable-next-line:max-line-length
		const custParams = /&cust_params=uno%3Dfoo%26due%3D15%26tre%3Dbar%2Czero%26wsi%3Dxxxx%26src%3Dtest%26pos%3Dtop_leaderboard/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build URL with restricted number of ads', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', { numberOfAds: 1 });

		const custParams = /&pmad=1/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build URL with content source and video ids', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			contentSourceId: '123',
			videoId: 'abc',
		});

		const custParams = /&cmsid=123&vid=abc/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build URL without content source and video ids when at least one is missing', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			contentSourceId: '123',
		});

		const custParams = /&cmsid=123/;

		expect(vastUrl.match(custParams)).to.not.be.ok;
	});

	it('build URL without content source and video ids when at least one is missing', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			videoId: 'abc',
		});

		const custParams = /&vid=abc/;

		expect(vastUrl.match(custParams)).to.not.be.ok;
	});

	it('build URL with preroll video position', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			vpos: 'preroll',
		});

		const custParams = /&vpos=preroll/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build URL with midroll video position', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			vpos: 'midroll',
		});

		const custParams = /&vpos=midroll/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build URL with postroll video position', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			vpos: 'postroll',
		});

		const custParams = /&vpos=postroll/;

		expect(vastUrl.match(custParams)).to.be.ok;
	});

	it('build URL without video position', () => {
		const vastUrl = buildVastUrl(1, 'top_leaderboard', {
			vpos: 'invalid',
		});

		const custParams = /&vpos=/;

		expect(vastUrl.match(custParams)).to.not.be.ok;
	});
});
