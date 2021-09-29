import {
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	SlotDecisionOnViewabilityHandler,
	SlotHiddenHandler,
	SlotTransitionIhiHandler,
} from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { FloorAdhesionAnchorHiddenHandler } from './handlers/floor-adhesion/floor-adhesion-anchor-hidden-handler';
import { FloorAdhesionBootstrapHandler } from './handlers/floor-adhesion/floor-adhesion-bootstrap-handler';
import { FloorAdhesionCloseButtonHandler } from './handlers/floor-adhesion/floor-adhesion-close-button-handler';

export function registerFloorAdhesionTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'floorAdhesion',
		{
			initial: [FloorAdhesionBootstrapHandler, DebugTransitionHandler],
			display: [
				SlotDecisionOnViewabilityHandler,
				FloorAdhesionCloseButtonHandler,
				DomCleanupHandler,
			],
			transition: [SlotTransitionIhiHandler, DomCleanupHandler],
			hidden: [SlotHiddenHandler, FloorAdhesionAnchorHiddenHandler, DomCleanupHandler],
		},
		'initial',
		[DomManipulator],
	);
}
