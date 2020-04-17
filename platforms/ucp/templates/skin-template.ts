import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { SkinHandler } from './handlers/skin/skin-handler';

export function registerSkinTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'skin',
		{
			initial: [SkinHandler],
		},
		'initial',
	);
}
