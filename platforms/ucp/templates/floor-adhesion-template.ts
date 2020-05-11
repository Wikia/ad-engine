import {
	CloseToHiddenIhiButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	FloorAdhesionBootstrapHandler,
	SlotHiddenHandler,
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
			display: [CloseToHiddenIhiButtonHandler, DomCleanupHandler],
			hidden: [SlotHiddenHandler, DomCleanupHandler],
		},
		'initial',
		[DomManipulator],
	);
}
