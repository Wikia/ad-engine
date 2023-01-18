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
	SlotDecisionTimeoutHandler,
	SlotHeightClippingHandler,
	SlotSizeImpactWithPlaceholderHandler,
	SlotSizeResolvedWithPlaceholderHandler,
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
import { TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { registerUapDomElements } from './configs/register-uap-dom-elements';
import { BfaaConfigHandler } from './handlers/bfaa/bfaa-config-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	const templateStates = {
		initial: [
			BfaaConfigHandler,
			BfaaBootstrapHandler,
			VideoBootstrapHandler,
			VideoCtpHandler,
			VideoRestartHandler,
			AdvertisementLabelHandler,
			DebugTransitionHandler,
		],
		impact: [
			SlotSizeImpactWithPlaceholderHandler,
			SlotDecisionImpactToResolvedHandler,
			SlotHeightClippingHandler,
			VideoSizeImpactToResolvedHandler,
			VideoCompletedHandler,
			DomCleanupHandler,
		],
		sticky: [
			SlotSizeResolvedWithPlaceholderHandler,
			SlotDecisionTimeoutHandler,
			CloseToTransitionButtonHandler,
			VideoSizeResolvedHandler,
			DomCleanupHandler,
		],
		transition: [
			SlotSizeResolvedWithPlaceholderHandler,
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
	};

	return registry.register('bfaa', templateStates, 'initial', [
		ScrollCorrector,
		PlayerRegistry,
		DomManipulator,
		UapDomManager,
		UapDomReader,
		VideoDomReader,
		VideoDomManager,
		CloseButtonHelper,
		StickinessTimeout.provide(universalAdPackage.BFAA_UNSTICK_DELAY),
		registerUapDomElements(),
	]);
}
