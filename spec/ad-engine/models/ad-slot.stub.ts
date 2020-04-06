import { AdSlot } from '@wikia/ad-engine';
import { SinonSandbox, SinonStub } from 'sinon';
import { createEventEmitterStub } from './event-emitter.stub';

export type AdSlotStub = { [key in keyof AdSlot]: SinonStub & AdSlot[key] };

export function createAdSlotStub(sandbox: SinonSandbox): AdSlotStub {
	return {
		...createEventEmitterStub(sandbox),
		targeting: sandbox.stub() as any,
		config: sandbox.stub() as any,
		element: sandbox.stub() as any,
		status: sandbox.stub() as any,
		isEmpty: sandbox.stub() as any,
		pushTime: sandbox.stub() as any,
		enabled: sandbox.stub() as any,
		events: sandbox.stub() as any,
		adUnit: sandbox.stub() as any,
		advertiserId: sandbox.stub() as any,
		orderId: sandbox.stub() as any,
		creativeId: sandbox.stub() as any,
		creativeSize: sandbox.stub() as any,
		lineItemId: sandbox.stub() as any,
		winningBidderDetails: sandbox.stub() as any,
		trackOnStatusChanged: sandbox.stub() as any,
		requested: sandbox.stub().resolves() as any,
		loaded: sandbox.stub().resolves() as any,
		rendered: sandbox.stub().resolves() as any,
		viewed: sandbox.stub().resolves() as any,
		getAdUnit: sandbox.stub(),
		getVideoAdUnit: sandbox.stub(),
		getElement: sandbox.stub(),
		getAdContainer: sandbox.stub(),
		getIframe: sandbox.stub(),
		getFrameType: sandbox.stub(),
		getMainPositionName: sandbox.stub(),
		getUid: sandbox.stub(),
		getSlotName: sandbox.stub(),
		getSizes: sandbox.stub(),
		getTargeting: sandbox.stub(),
		getDefaultSizes: sandbox.stub(),
		getVideoSizes: sandbox.stub(),
		getViewportConflicts: sandbox.stub(),
		hasDefinedViewportConflicts: sandbox.stub(),
		getStatus: sandbox.stub(),
		getPushTime: sandbox.stub(),
		setStatus: sandbox.stub(),
		isEnabled: sandbox.stub(),
		isFirstCall: sandbox.stub(),
		isViewed: sandbox.stub(),
		isDismissed: sandbox.stub(),
		isRepeatable: sandbox.stub(),
		isOutOfPage: sandbox.stub(),
		getCopy: sandbox.stub(),
		getTopOffset: sandbox.stub(),
		enable: sandbox.stub(),
		disable: sandbox.stub(),
		destroy: sandbox.stub(),
		getConfigProperty: sandbox.stub(),
		setConfigProperty: sandbox.stub(),
		success: sandbox.stub(),
		collapse: sandbox.stub(),
		updateWinningPbBidderDetails: sandbox.stub(),
		updateWinningA9BidderDetails: sandbox.stub(),
		addClass: sandbox.stub(),
		removeClass: sandbox.stub(),
		hide: sandbox.stub(),
		show: sandbox.stub(),
		emit: sandbox.stub(),
		emitEvent: sandbox.stub(),
		getSlotsToPushAfterCreated: sandbox.stub(),
		getSlotsToInjectAfterRendered: sandbox.stub(),
	};
}
