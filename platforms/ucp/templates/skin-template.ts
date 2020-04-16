import { TemplateAction, TemplateRegistry } from '@wikia/ad-engine';
import { Observable } from 'rxjs';
import { SkinHandler } from './handlers/skin/skin-handler';
import { DomManipulator } from './helpers/manipulators/dom-manipulator';

export function registerSkinTemplate(registry: TemplateRegistry): Observable<TemplateAction> {
	return registry.register(
		'skin',
		{
			initial: [SkinHandler],
		},
		'initial',
		[DomManipulator],
	);
}
