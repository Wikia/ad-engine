import { DebugTransitionHandler, DomCleanupHandler, DomManipulator } from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { StickyIcbBootstrapHandler } from './handlers/sticky-icb/sticky-icb-bootstrap-handler';
import { StickyIcbDisabledHandler } from './handlers/sticky-icb/sticky-icb-disabled-handler';
import { SlotStateWaitingToIncontentStickyHandler } from './handlers/sticky-icb/slot-state-waiting-to-incontent-sticky-handler';
import { SlotStateIncontentStickedHandler } from './handlers/sticky-icb/slot-state-incontent-sticked-handler';

export function registerStickyIcbTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'stickyIcb',
		{
			initial: [StickyIcbBootstrapHandler, DebugTransitionHandler],
			waiting: [SlotStateWaitingToIncontentStickyHandler],
			sticky: [SlotStateIncontentStickedHandler, DomCleanupHandler],
			done: [StickyIcbDisabledHandler],
		},
		'initial',
		[DomManipulator],
	);
}
