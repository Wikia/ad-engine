import { RoadblockHandler } from '@platforms/shared';
import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';

export function registerRoadblockTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'roadblock',
		{
			initial: [RoadblockHandler],
		},
		'initial',
		[
			RoadblockHandler.config({
				enabledSlots: ['top_boxad', 'invisible_skin'],
				disableSlots: ['incontent_player', 'floor_adhesion', 'affiliate_slot'],
			}),
		],
	);
}
