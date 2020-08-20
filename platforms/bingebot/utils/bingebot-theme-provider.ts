import { communicationService, globalAction, ofType } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { props } from 'ts-action';
import { BingebotTheme } from './bingebot-theme';

export const setBingebotTheme = globalAction(
	'[BingeBot] set theme',
	props<{ theme: BingebotTheme }>(),
);

@Injectable()
export class BingebotThemeProvider {
	private theme$: Observable<BingebotTheme>;

	get theme(): Promise<BingebotTheme> {
		return this.theme$.toPromise();
	}

	constructor() {
		this.theme$ = communicationService.action$.pipe(
			ofType(setBingebotTheme),
			map(({ theme }) => theme),
			shareReplay(1),
		);
		this.theme$.subscribe();
	}
}
