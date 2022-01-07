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
import { selectApplication } from '../utils/application-helper';
import { registerFutheadUapDomElements } from './configs/register-futhead-uap-dom-elements';
import { registerMutheadUapDomElements } from './configs/register-muthead-uap-dom-elements';
import { BfaaSportsConfigHandler } from './handlers/bfaa/bfaa-sports-config-handler';

export function registerBfaaTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'bfaa',
		{
			initial: [
				BfaaSportsConfigHandler,
				BfaaBootstrapHandler,
				VideoBootstrapHandler,
				VideoCtpHandler,
				VideoRestartHandler,
				AdvertisementLabelHandler,
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
			selectApplication(registerFutheadUapDomElements(), registerMutheadUapDomElements()),
		],
	);
}
