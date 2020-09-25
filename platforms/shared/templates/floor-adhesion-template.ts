import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { CloseToHiddenIhiButtonHandler } from './handlers/close-to-hidden-ihi-button-handler';
import { DebugTransitionHandler } from './handlers/debug-transition-handler';
import { DomCleanupHandler } from './handlers/dom-cleanup-handler';
import { FloorAdhesionBootstrapHandler } from './handlers/floor-adhesion/floor-adhesion-bootstrap-handler';
import { SlotDecisionOnViewabilityHandler } from './handlers/slot/slot-decision-on-viewability-handler';
import { SlotHiddenHandler } from './handlers/slot/slot-hidden-handler';
import { SlotTransitionIhiHandler } from './handlers/slot/slot-transition-ihi-handler';
import { DomManipulator } from './helpers/manipulators/dom-manipulator';

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
