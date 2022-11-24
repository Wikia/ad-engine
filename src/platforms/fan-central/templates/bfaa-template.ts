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
	VideoLearnMoreHandler,
	VideoRestartHandler,
	VideoSizeImpactToResolvedHandler,
	VideoSizeResolvedHandler,
} from '@platforms/shared';
import { context, TemplateAction, TemplateRegistry, universalAdPackage } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { registerFanCentralUapDomElements } from './configs/register-fan-central-uap-dom-elements';
import { BfaaFanCentralConfigHandler } from './handlers/bfaa/bfaa-fan-central-config-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	const templateStates = {
		initial: [
			BfaaFanCentralConfigHandler,
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
			SlotStateStickedHandler,
			CloseToTransitionButtonHandler,
			VideoSizeResolvedHandler,
			DomCleanupHandler,
		],
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
		registerFanCentralUapDomElements(),
	]);
}
