import {
	AdvertisementLabelHandler,
	BfaaBootstrapHandler,
	CloseButtonHelper,
	CloseToTransitionButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionImpactToResolvedHandler,
	SlotDecisionStickyToResolvedHandler,
	SlotDecisionTimeoutHandler,
	SlotHeightClippingHandler,
	SlotSizeImpactWithPlaceholderHandler,
	SlotSizeResolvedWithPlaceholderHandler,
	SlotStateStickedHandler,
	SlotTransitionHandler,
	StickinessTimeout,
	UapDomManager,
	UapDomReader,
	VideoBootstrapHandler,
	VideoCompletedHandler,
	VideoCtpHandler,
	VideoDomManager,
	VideoDomReader,
	VideoRestartHandler,
	VideoSizeImpactToResolvedHandler,
	VideoSizeResolvedHandler,
} from '@platforms/shared';
import { context, TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { registerUcpDesktopUapDomElements } from './configs/register-ucp-desktop-uap-dom-elements';
import { BfaaUcpDesktopConfigHandler } from './handlers/bfaa/bfaa-ucp-desktop-config-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	// Use the correct class based on the stick leaderboard context
	const slotDecisionResolvedHandler = () =>
		context.get('options.stickyTopLeaderboard')
			? SlotDecisionStickyToResolvedHandler
			: SlotDecisionImpactToResolvedHandler;

	// Default stickly handlers
	let stickyHandlers = [
		SlotSizeResolvedWithPlaceholderHandler,
		SlotDecisionTimeoutHandler,
		SlotStateStickedHandler,
		CloseToTransitionButtonHandler,
		VideoSizeResolvedHandler,
		DomCleanupHandler,
	];

	// Remove 'SlotDecisionTimeoutHandler' to prevent top leaderboard from disappearing
	// when sticky leaderboard is active
	if (context.get('options.stickyTopLeaderboard')) {
		stickyHandlers = stickyHandlers.filter((handler) => handler !== SlotDecisionTimeoutHandler);
	}

	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaUcpDesktopConfigHandler,
				BfaaBootstrapHandler,
				VideoBootstrapHandler,
				VideoCtpHandler,
				VideoRestartHandler,
				AdvertisementLabelHandler,
				DebugTransitionHandler,
			],
			impact: [
				SlotSizeImpactWithPlaceholderHandler,
				slotDecisionResolvedHandler(),
				SlotHeightClippingHandler,
				VideoSizeImpactToResolvedHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			sticky: stickyHandlers,
			transition: [
				SlotSizeResolvedWithPlaceholderHandler,
				SlotStateStickedHandler,
				SlotTransitionHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeResolvedWithPlaceholderHandler,
				SlotHeightClippingHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
		},
		'initial',
		[
			ScrollCorrector,
			PlayerRegistry,
			DomManipulator,
			UapDomManager,
			UapDomReader,
			VideoDomReader,
			VideoDomManager,
			CloseButtonHelper,
			StickinessTimeout.provide(universalAdPackage.BFAA_UNSTICK_DELAY),
			registerUcpDesktopUapDomElements(),
		],
	);
}
