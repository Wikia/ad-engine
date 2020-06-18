import {
	AdvertisementLabelHandler,
	BfaaBootstrapHandler,
	CloseButtonHelper,
	CloseToTransitionButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	NavbarOffsetImpactToResolvedHandler,
	NavbarOffsetResolvedHandler,
	NavbarOffsetResolvedToNoneHandler,
	PageOffsetImpactHandler,
	PageOffsetResolvedHandler,
	PlayerRegistry,
	ScrollCorrector,
	SlotDecisionImpactToResolvedHandler,
	SlotDecisionTimeoutHandler,
	SlotOffsetResolvedToNoneHandler,
	SlotSizeImpactToResolvedHandler,
	SlotSizeResolvedHandler,
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
import { BfaaF2ConfigHandler } from './handlers/bfaa/bfaa-f2-config-handler';
import { HideSmartBannerHandler } from './handlers/hide-smart-banner-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaF2ConfigHandler,
				BfaaBootstrapHandler,
				VideoBootstrapHandler,
				VideoCtpHandler,
				VideoRestartHandler,
				AdvertisementLabelHandler,
				HideSmartBannerHandler,
				DebugTransitionHandler,
			],
			impact: [
				SlotSizeImpactToResolvedHandler,
				SlotDecisionImpactToResolvedHandler,
				NavbarOffsetImpactToResolvedHandler,
				PageOffsetImpactHandler,
				VideoSizeImpactToResolvedHandler,
				VideoCompletedHandler,
				DomCleanupHandler,
			],
			sticky: [
				SlotSizeResolvedHandler,
				PageOffsetResolvedHandler,
				NavbarOffsetResolvedHandler,
				SlotDecisionTimeoutHandler,
				CloseToTransitionButtonHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			transition: [
				SlotSizeResolvedHandler,
				PageOffsetResolvedHandler,
				NavbarOffsetResolvedHandler,
				SlotTransitionHandler,
				VideoSizeResolvedHandler,
				DomCleanupHandler,
			],
			resolved: [
				SlotSizeResolvedHandler,
				SlotOffsetResolvedToNoneHandler,
				NavbarOffsetResolvedToNoneHandler,
				PageOffsetResolvedHandler,
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
		],
	);
}
