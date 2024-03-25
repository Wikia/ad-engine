// @ts-strict-ignore
import { TargetingObject, TargetingService, targetingService } from '@wikia/core';
import { context } from '@wikia/core/services/context-service';
import { vastParser } from '@wikia/core/video/vast-parser';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

const dummyVastTagUrl =
	'dummy.vast?sz=640x480&foo=bar&cust_params=foo1%3Dbar1%26foo2%3Dbar2' +
	'%26customTitle%3D100%25%20Orange%20Juice%3Dbar2&vpos=preroll';

const dummyVastTagXml =
	'<?xml version="1.0" encoding="UTF-8"?><VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="4.0">';

function getImaAd(
	wrapperIds = [],
	wrapperCreativeIds = [],
	getWrapperAdSystems = [],
): google.ima.Ad {
	return {
		getAdId: () => '000',
		getContentType: () => 'text/javascript',
		getCreativeId: () => '999',
		getWrapperAdIds: () => wrapperIds,
		getWrapperCreativeIds: () => wrapperCreativeIds,
		getWrapperAdSystems: () => getWrapperAdSystems,
	} as google.ima.Ad;
}

describe('vast-parser', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;
	const targetingData = {
		uno: 'foo',
		due: 15,
		tre: ['bar', 'zero'],
		quattro: null,
	};

	beforeEach(() => {
		context.extend({
			vast: {
				adUnitId: '/5441/wka.fandom/{src}/{pos}',
			},
		});

		targetingServiceStub = global.sandbox.stub(targetingService);
		targetingServiceStub.dump.returns(targetingData);
		targetingServiceStub.extend.callsFake((newTargeting: TargetingObject) => {
			Object.assign(targetingData, newTargeting);
		});
	});

	it('parse custom parameters from VAST url', () => {
		const adInfo = vastParser.parse(dummyVastTagUrl);

		expect(adInfo.customParams.foo1).to.equal('bar1');
		expect(adInfo.customParams.foo2).to.equal('bar2');
		expect(adInfo.customParams.customTitle).to.equal('100% Orange Juice');
	});

	it('parse size from VAST url', () => {
		const adInfo = vastParser.parse(dummyVastTagUrl);

		expect(adInfo.size).to.equal('640x480');
	});

	it('parse position from VAST url', () => {
		const adInfo = vastParser.parse(dummyVastTagUrl);

		expect(adInfo.position).to.equal('preroll');
	});

	it('current ad info is not set by default', () => {
		const adInfo = vastParser.parse(dummyVastTagUrl);

		expect(adInfo.contentType).to.equal(undefined);
		expect(adInfo.creativeId).to.equal(undefined);
		expect(adInfo.lineItemId).to.equal(undefined);
	});

	it('current ad info from IMA object', () => {
		const adInfo = vastParser.parse(dummyVastTagUrl, {
			imaAd: getImaAd(),
		});

		expect(adInfo.contentType).to.equal('text/javascript');
		expect(adInfo.creativeId).to.equal('999');
		expect(adInfo.lineItemId).to.equal('000');
	});

	it('position from extra.eventAdPosition is mapped properly when VAST is not URL', () => {
		const adInfo = vastParser.parse(dummyVastTagXml, {
			imaAd: getImaAd(),
			eventAdPosition: 'post',
		});

		expect(adInfo.position).to.equal('postroll');
	});

	it('current ad info from IMA object', () => {
		const adInfo = vastParser.getAdInfo(getImaAd(['222', '333'], ['555', '666']));

		expect(adInfo.contentType).to.equal('text/javascript');
		expect(adInfo.creativeId).to.equal('666');
		expect(adInfo.lineItemId).to.equal('333');
	});

	it('current ad info from IMA object with incorrect wrapper ids', () => {
		const adInfo = vastParser.getAdInfo(getImaAd(['foo', 'foo1'], ['bar2', 'bar']));

		expect(adInfo.creativeId).to.equal('');
		expect(adInfo.lineItemId).to.equal('');
	});

	it('current ad info from IMA object with AdX response', () => {
		const adInfo = vastParser.getAdInfo(
			getImaAd(['222', '333'], ['555', '666'], ['Wikia', 'AdSense/AdX']),
		);

		expect(adInfo.contentType).to.equal('text/javascript');
		expect(adInfo.creativeId).to.equal('AdX');
		expect(adInfo.lineItemId).to.equal('AdX');
	});
});
