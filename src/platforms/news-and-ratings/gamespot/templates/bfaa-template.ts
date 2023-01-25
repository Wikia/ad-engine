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
	SlotSizeImpactToResolvedHandler,
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
	VideoLearnMoreHandler,
	VideoRestartHandler,
	VideoSizeImpactToResolvedHandler,
	VideoSizeResolvedHandler,
} from '@platforms/shared';
import { context, TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { registerUapDomElements } from './configs/register-uap-dom-elements';
import { BfaaGamespotConfigHandler } from './handlers/bfaa/bfaa-gamespot-config-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	const templateStates = {
		initial: [
			BfaaGamespotConfigHandler,
			BfaaBootstrapHandler,
			VideoBootstrapHandler,
			VideoCtpHandler,
			VideoRestartHandler,
			AdvertisementLabelHandler,
			DebugTransitionHandler,
		],
		impact: [],
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

	if (context.get('state.isMobile')) {
		templateStates.impact = [
			SlotSizeImpactWithPlaceholderHandler,
			SlotSizeImpactToResolvedHandler,
			SlotDecisionImpactToResolvedHandler,
			VideoSizeImpactToResolvedHandler,
			VideoCompletedHandler,
			VideoLearnMoreHandler,
			DomCleanupHandler,
		];
	} else {
		templateStates.impact = [
			SlotSizeImpactWithPlaceholderHandler,
			SlotDecisionImpactToResolvedHandler,
			SlotHeightClippingHandler,
			VideoSizeImpactToResolvedHandler,
			VideoCompletedHandler,
			DomCleanupHandler,
		];
	}

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
