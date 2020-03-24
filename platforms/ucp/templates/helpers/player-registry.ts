import {
	AdSlot,
	Porvata,
	Porvata4Player,
	PorvataTemplateParams,
	resolvedState,
	TEMPLATE,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { ReplaySubject } from 'rxjs';

@Injectable({ autobind: false })
export class PlayerRegistry {
	private state$ = new ReplaySubject<{ player: Porvata4Player; params: PorvataTemplateParams }>(1);
	video$ = this.state$.asObservable();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
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
			vastTargeting: { passback: universalAdPackage.getType() },
			autoPlay: this.isAutoPlayEnabled(),
			container: this.createPlayerContainer(),
			hideWhenPlaying: this.params.videoPlaceholderElement,
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
		const resolvedStateAutoPlay = this.params.resolvedStateAutoPlay && isResolvedState;

		return Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
	}

	private setCtpTargeting(isAutoPlayEnabled: boolean): void {
		const audioSuffix = !isAutoPlayEnabled ? '-audio' : '';
		const clickToPlaySuffix = isAutoPlayEnabled ? '' : '-ctp';

		this.adSlot.setConfigProperty('slotNameSuffix', clickToPlaySuffix || audioSuffix || '');
		this.adSlot.setConfigProperty('targeting.audio', audioSuffix ? 'yes' : 'no');
		this.adSlot.setConfigProperty('targeting.ctp', clickToPlaySuffix ? 'yes' : 'no');
	}

	/**
	 * Marks player as not usable - releases all resources waiting for video$ stream.
	 */
	discard(): void {
		this.state$.complete();
	}
}
