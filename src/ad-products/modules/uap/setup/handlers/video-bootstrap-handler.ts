// @ts-strict-ignore
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { TemplateStateHandler } from "../../../../../core/services/templates-registry/template-state-handler";
import { universalAdPackage, UapParams } from "../../utils/universal-ad-package";
import { AdSlotClass } from "../../../../../core/models/ad-slot-class";
import { communicationServiceSlim } from "../../utils/communication-service-slim";
import { GAM_LOAD_TEMPLATE } from "../../../../../communication/events/events-gam";
import { AdSlotEvent } from "../../../../../core/models";
import { AdSlotEventPayload } from "../../../../../communication/event-types";
import { PorvataPlayer } from "./video/porvata/porvata-player";
import { PlayerRegistry } from "./video/player-registry";
import { PorvataTemplateParams } from "./video/porvata/porvata";
import { ProgressBar } from "./video/progress-bar";
import { createBottomPanel } from "./video/video-interface";
import { ToggleUI } from "./video/toggle-ui";
import { ToggleVideo } from "./video/toggle-video";
import { ToggleThumbnail } from "./video/toggle-thumbnail";
import { PlayerOverlay } from "./video/player-overlay";
import { LearnMore } from "./video/learn-more";
import { context } from "../../../../../core/services/context-service";
import { generateUniqueId, stringBuilder } from "../../../../../core/utils";
import { PorvataParams } from "./video/porvata/porvata-settings";
import { FAN_TAKEOVER_TYPES } from "../../../../../ad-products/templates/uap/constants";

export class VideoBootstrapHandler implements TemplateStateHandler {
    static DEBOUNCE_TIME = 10;
    private destroy$ = new Subject<void>();

    constructor(
        private params: UapParams,
        private playerRegistry: PlayerRegistry,
    ) {
        context.set('slots.videoslot.uid', generateUniqueId());
        context.set('slotGroups', {
            VIDEO: ['FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
        });
    }

    async onEnter(): Promise<void> {
        if (!universalAdPackage.isVideoEnabled(this.params)) {
            return this.playerRegistry.discard();
        }

        this.setupSlotVideoAdUnit(this.params);
        this.playerRegistry.register();
        this.playerRegistry.video$
            .pipe(
                take(1),
                tap(({ player, params }) => this.adjustUI(player, params)),
                mergeMap(({ player }) => this.handleEvents(player)),
                takeUntil(this.destroy$),
            )
            .subscribe();
    }

    private setupSlotVideoAdUnit(params: PorvataParams): void {
        function findSlotGroup(product): string {
            const slotGroups = context.get('slotGroups') || {};
            const result = Object.keys(slotGroups).filter((name) => slotGroups[name].indexOf(product) !== -1);

            return result.length === 1 ? result[0] : null;
        }

        let product = params.slotName;
        if (FAN_TAKEOVER_TYPES.includes(<'uap'|'vuap'>params.adProduct)) {
            product = `UAP_${params.type.toUpperCase()}`;
        }

        const slotConfig = {
            group: findSlotGroup(product.toUpperCase()) || 'OTHER',
            adProduct: product.toLowerCase(),
            slotNameSuffix: '',
        };

        const adUnit = stringBuilder.build(
            context.get(`slots.${params.slotName}.videoAdUnit`) || context.get('vast.adUnitId'),
            {
                slotConfig,
            },
        );

        context.set(`slots.${params.slotName}.videoAdUnit`, adUnit);
    }

    private handleEvents(player: PorvataPlayer): Observable<unknown> {
        communicationServiceSlim.on(
            communicationServiceSlim.getGlobalAction(GAM_LOAD_TEMPLATE),
            (action: AdSlotEventPayload) => {
                if (action.event === AdSlotEvent.CUSTOM_EVENT &&
                    action.adSlotName === this.params.slotName &&
                    action.payload?.status === universalAdPackage.SLOT_FORCE_UNSTICK) {
                    player.stop();
                }
            }
        );

        return merge(
            fromEvent(player, 'adCanPlay').pipe(
                tap(() => player.dom.getVideoContainer().classList.remove(AdSlotClass.HIDDEN_AD_CLASS)),
            ),

            fromEvent(player, 'wikiaAdStarted').pipe(
                mergeMap(() => fromEvent(player, 'wikiaAdCompleted')),
                // after reload this handler registers again to wikiaAdCompleted event of the player
                // causing multiple requests to GAM - debounce is a workaround to stop this madness
                // as a quick P2 fix - more in ADEN-11546 and related tickets
                debounceTime(VideoBootstrapHandler.DEBOUNCE_TIME),
                tap(() => player.reload()),
            ),
        );
    }

    private adjustUI(player: PorvataPlayer, params: PorvataTemplateParams): void {
        ProgressBar.add(player, player.dom.getInterfaceContainer());
        createBottomPanel().add(player, player.dom.getInterfaceContainer(), params);
        ToggleUI.add(player, player.dom.getInterfaceContainer(), params);
        ToggleVideo.add(player, params.container.parentElement);
        ToggleThumbnail.add(player, undefined, params);
        PlayerOverlay.add(player, player.dom.getPlayerContainer(), params);
        LearnMore.add(player, player.dom.getPlayerContainer(), params);
    }

    async onDestroy(): Promise<void> {
        this.destroy$.next();
        this.destroy$.complete();
        this.playerRegistry.discard();
    }
}
