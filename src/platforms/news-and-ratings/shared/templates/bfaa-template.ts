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
import { context, TemplateAction, TemplateDependency, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { BfaaNewsAndRatingsConfigHandler } from './handlers/bfaa/bfaa-news-and-ratings-config-handler';

const BFAA_LONG_UNSTICK_DELAY = 10000000;

export function registerBfaaTemplate(
	registry: TemplateRegistry,
	registerUapDomElements: () => TemplateDependency[],
): Observable<TemplateAction> {
	const templateStates = {
		initial: [
			BfaaNewsAndRatingsConfigHandler,
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
		StickinessTimeout.provide(BFAA_LONG_UNSTICK_DELAY),
		registerUapDomElements(),
	]);
}
