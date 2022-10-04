import { Observable } from 'rxjs';
import { logger } from '../../utils/logger';
import { TemplateAction } from './template-action';

export function logTemplates(stream$: Observable<TemplateAction>): void {
	stream$.subscribe((action) => {
		logger(
			`TemplateLogger - ${action.templateName}\n`,
			`StateName: ${action.stateName}, Type: ${action.type}`,
		);
	});
}
