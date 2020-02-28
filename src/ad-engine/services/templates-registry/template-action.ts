import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RxJsOperator } from '../../rxjs/rxjs-operator';

export interface TemplateAction {
	templateName: string;
	stateName: string;
	type: 'leaving' | 'left' | 'entering' | 'entered' | 'initialising' | 'initialised';
}

export function ofTemplateAction(
	...types: TemplateAction['type'][]
): RxJsOperator<TemplateAction, TemplateAction> {
	return (source: Observable<TemplateAction>) =>
		source.pipe(filter((action) => types.includes(action.type)));
}
