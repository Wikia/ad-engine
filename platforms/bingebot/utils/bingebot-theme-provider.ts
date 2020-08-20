import { communicationService, globalAction, ofType } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { map, shareReplay, take } from 'rxjs/operators';
import { props } from 'ts-action';
import { BingebotTheme } from './bingebot-theme';

export const setBingebotTheme = globalAction(
	'[BingeBot] set theme',
	props<{ theme: BingebotTheme }>(),
);

@Injectable()
export class BingebotThemeProvider {
	get theme(): Promise<BingebotTheme> {
		return communicationService.action$
			.pipe(
				ofType(setBingebotTheme),
				map(({ theme }) => theme),
				shareReplay(1), // take only newest value
				take(1),
			)
			.toPromise();
	}
}
