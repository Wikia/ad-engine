import { TemplateAction, TemplateRegistry } from '@ad-engine/core';
import { RoadblockHandler } from '@platforms/shared';
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
				enabledSlots: ['top_boxad', 'fandom_dt_galleries', 'gallery_leaderboard'],
				disableSlots: ['floor_adhesion'],
			}),
		],
	);
}
