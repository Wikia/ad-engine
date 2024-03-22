import { ReplaySubject } from 'rxjs';
import { UapParams } from "../../../utils/universal-ad-package";
import { Porvata, PorvataTemplateParams } from "./porvata/porvata";
import { PorvataPlayer } from "./porvata/porvata-player";
import { AdSlotClass } from "../../../../../core/models/ad-slot-class";
import { resolvedState } from "../../../utils/resolved-state";
import SlotPlaceholderRetriever from "../../../utils/slot-placeholder-retriever";
import { targetingService } from "../../../../../core/services/targeting-service";
import { context } from "../../../../../core/services/context-service";

export class PlayerRegistry {
    private state$ = new ReplaySubject<{ player: PorvataPlayer; params: PorvataTemplateParams }>(1);
    video$ = this.state$.asObservable();
    private slot;

    constructor(
        private params: UapParams,
        private porvata: Porvata,
    ) {
        this.slot = (new SlotPlaceholderRetriever(this.params)).get();
    }

    /**
     * Creates player and distributes it alongside playerParams with video$ stream.
     */
    register(): void {
        const params: PorvataTemplateParams = this.getPlayerParams();

        this.setCtpTargeting(params.autoPlay);
        this.porvata.inject(params).then((player) => this.state$.next({ player, params }));
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
        const playerContainer = this.porvata.createVideoContainer(this.slot);

        playerContainer.parentElement.classList.add(AdSlotClass.HIDDEN_AD_CLASS);

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

        context.set(`slots.${this.params.slotName}.slotNameSuffix`, clickToPlaySuffix || audioSuffix || '');
        targetingService.set('audio', audioSuffix ? 'yes' : 'no', this.params.slotName);
        targetingService.set('ctp', clickToPlaySuffix ? 'yes' : 'no', this.params.slotName);
    }

    /**
     * Marks player as not usable - releases all resources waiting for video$ stream.
     */
    discard(): void {
        this.state$.complete();
    }
}
