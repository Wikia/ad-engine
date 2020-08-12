import { RxJsOperator } from '@ad-engine/models';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface TemplateAction {
	templateName: string;
	stateName: string;
	type:
		| 'leaving'
		| 'left'
		| 'entering'
		| 'entered'
		| 'initialising'
		| 'initialised'
		| 'destroying'
		| 'destroyed';
}

export function ofTemplateAction(
	...types: TemplateAction['type'][]
): RxJsOperator<TemplateAction, TemplateAction> {
	return (source: Observable<TemplateAction>) =>
		source.pipe(filter((action) => types.includes(action.type)));
}
