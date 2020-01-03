import { pbjsFactory } from '@wikia/ad-engine/services/pbjs-factory';
import { SinonSandbox, SinonStub } from 'sinon';

export type PbjsStub = { [key in keyof Pbjs]: SinonStub & Pbjs[key] };

export function createPbjsStub(sandbox: SinonSandbox): PbjsStub {
	return {
		bidderSettings: sandbox.stub() as any,
		adUnits: sandbox.stub() as any,
		requestBids: sandbox.stub(),
		removeAdUnit: sandbox.stub(),
		aliasBidder: sandbox.stub(),
		registerBidAdapter: sandbox.stub(),
		markWinningBidAsUsed: sandbox.stub(),
		getBidResponsesForAdUnitCode: sandbox.stub().returns({ bids: [] }),
		setConfig: sandbox.stub(),
		createBid: sandbox.stub().returns({}),
		renderAd: sandbox.stub(),
		onEvent: sandbox.stub(),
		offEvent: sandbox.stub(),
	};
}

export function stubPbjs(
	sandbox: SinonSandbox,
	pbjsStub: PbjsStub = createPbjsStub(sandbox),
): { pbjsInitStub: SinonStub; pbjsStub: PbjsStub } {
	const pbjsInitStub = sandbox.stub(pbjsFactory, 'init').returns(Promise.resolve(pbjsStub));

	return {
		pbjsInitStub,
		pbjsStub,
	};
}
