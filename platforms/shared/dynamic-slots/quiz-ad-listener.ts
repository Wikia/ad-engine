import { communicationService, context, eventsRepository, ofType } from '@wikia/ad-engine';
import { map } from 'rxjs/operators';

export function quizAdListener(): void {
	communicationService.action$
		.pipe(
			ofType(communicationService.getGlobalAction(eventsRepository.QUIZ_AD_INJECTED)),
			map((payload) => payload),
		)
		.subscribe(({ slotId }) => {
			context.push('state.adStack', { id: slotId });
		});
}
