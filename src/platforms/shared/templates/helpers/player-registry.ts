import {
	AdSlot,
	Porvata,
	PorvataPlayer,
	PorvataTemplateParams,
	resolvedState,
	TEMPLATE,
	UapParams,
} from '@wikia/ad-engine';
import { ReplaySubject } from 'rxjs';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PlayerRegistry {
	private state$ = new ReplaySubject<{ player: PorvataPlayer; params: PorvataTemplateParams }>(1);
	video$ = this.state$.asObservable();

	constructor(
		@inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@inject(TEMPLATE.PARAMS) private params: UapParams,
	) {}

	/**
	 * Creates player and distributes it alongside playerParams with video$ stream.
	 */
	register(): void {
		const params: PorvataTemplateParams = this.getPlayerParams();

		this.setCtpTargeting(params.autoPlay);
		Porvata.inject(params).then((player) => this.state$.next({ player, params }));
	}

	private getPlayerParams(): PorvataTemplateParams {
		return {
			...this.params,
			vastTargeting: {},
			autoPlay: this.isAutoPlayEnabled(),
			container: this.createPlayerContainer(),
			hideWhenPlaying: this.params.thumbnail,
		};
	}

	private createPlayerContainer(): HTMLDivElement {
		const playerContainer = Porvata.createVideoContainer(this.adSlot.getElement());

		playerContainer.parentElement.classList.add('hide');

		return playerContainer;
	}

	private isAutoPlayEnabled(): boolean {
		const isResolvedState = !resolvedState.isResolvedState(this.params);
		const defaultStateAutoPlay = this.params.autoPlay && !isResolvedState;
		const resolvedStateAutoPlay = this.params.autoPlay && isResolvedState;

		return Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
	}

	private setCtpTargeting(isAutoPlayEnabled: boolean): void {
		const audioSuffix = !isAutoPlayEnabled ? '-audio' : '';
		const clickToPlaySuffix = isAutoPlayEnabled ? '' : '-ctp';

		this.adSlot.setConfigProperty('slotNameSuffix', clickToPlaySuffix || audioSuffix || '');
		this.adSlot.setTargetingConfigProperty('audio', audioSuffix ? 'yes' : 'no');
		this.adSlot.setTargetingConfigProperty('ctp', clickToPlaySuffix ? 'yes' : 'no');
	}

	/**
	 * Marks player as not usable - releases all resources waiting for video$ stream.
	 */
	discard(): void {
		this.state$.complete();
	}
}
