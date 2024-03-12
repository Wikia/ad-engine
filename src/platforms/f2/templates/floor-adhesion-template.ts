import { TemplateAction, TemplateRegistry } from '@ad-engine/core';
import {
	CloseToHiddenIhiButtonHandler,
	DebugTransitionHandler,
	DomCleanupHandler,
	DomManipulator,
	SlotHiddenHandler,
	SlotTransitionIhiHandler,
} from '@platforms/shared';
import { Observable } from 'rxjs';
import { FloorAdhesionBootstrapHandler } from './handlers/floor-adhesion/floor-adhesion-bootstrap-handler';

export function registerFloorAdhesionTemplate(
	registry: TemplateRegistry,
): Observable<TemplateAction> {
	return registry.register(
		'floorAdhesion',
		{
			initial: [FloorAdhesionBootstrapHandler, DebugTransitionHandler],
			display: [CloseToHiddenIhiButtonHandler, DomCleanupHandler],
			transition: [SlotTransitionIhiHandler, DomCleanupHandler],
			hidden: [SlotHiddenHandler, DomCleanupHandler],
		},
		'initial',
		[DomManipulator],
	);
}
