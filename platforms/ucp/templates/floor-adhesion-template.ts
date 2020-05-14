import {
	CloseToHiddenIhiButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	FloorAdhesionBootstrapHandler,
	SlotDecisionOnViewabilityHandler,
	SlotHiddenHandler,
	SlotTransitionIhiHandler,
} from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';

export function registerFloorAdhesionTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'floorAdhesion',
		{
			initial: [FloorAdhesionBootstrapHandler, DebugTransitionHandler],
			display: [SlotDecisionOnViewabilityHandler, CloseToHiddenIhiButtonHandler, DomCleanupHandler],
			transition: [SlotTransitionIhiHandler, DomCleanupHandler],
			hidden: [SlotHiddenHandler, DomCleanupHandler],
		},
		'initial',
		[DomManipulator],
	);
}
