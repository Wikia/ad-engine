import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { RoadblockHandler } from './handlers/roadblock/roadblock-handler';

export function registerRoadblockTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'roadblock',
		{
			initial: [RoadblockHandler],
		},
		'initial',
	);
}
