import { Porvata4Player } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class PlayerRegistry {
	private state$ = new ReplaySubject<Porvata4Player>(1);
	player$ = this.state$.asObservable();

	register(player: Porvata4Player): void {
		this.state$.next(player);
	}
}
