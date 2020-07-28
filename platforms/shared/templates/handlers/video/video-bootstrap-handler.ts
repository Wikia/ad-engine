import {
	AdSlot,
	createBottomPanel,
	LearnMore,
	Porvata4Player,
	PorvataTemplateParams,
	ProgressBar,
	ReplayOverlay,
	TEMPLATE,
	TemplateStateHandler,
	ToggleThumbnail,
	ToggleUI,
	ToggleVideo,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { filter, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { slotsContext } from '../../../slots/slots-context';
import { PlayerRegistry } from '../../helpers/player-registry';

@Injectable({ autobind: false })
export class VideoBootstrapHandler implements TemplateStateHandler {
	private destroy$ = new Subject();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		private playerRegistry: PlayerRegistry,
	) {}

	async onEnter(): Promise<void> {
		if (!universalAdPackage.isVideoEnabled(this.params)) {
			return this.playerRegistry.discard();
		}

		slotsContext.setupSlotVideoAdUnit(this.adSlot, this.params);
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

	private handleEvents(player: Porvata4Player): Observable<unknown> {
		return merge(
			fromEvent(player, 'adCanPlay').pipe(
				tap(() => player.dom.getVideoContainer().classList.remove('hide')),
			),

			fromEvent(player, 'wikiaAdStarted').pipe(
				mergeMap(() => fromEvent(player, 'wikiaAdCompleted')),
				tap(() => player.reload()),
			),

			fromEvent(this.adSlot, AdSlot.CUSTOM_EVENT).pipe(
				filter(
					(event: { status: string }) => event.status === universalAdPackage.SLOT_FORCE_UNSTICK,
				),
				tap(() => player.stop()),
			),
		);
	}

	private adjustUI(player: Porvata4Player, params: PorvataTemplateParams): void {
		ProgressBar.add(player, player.dom.getInterfaceContainer());
		createBottomPanel({ fullscreenAllowed: this.params.fullscreenAllowed, theme: 'hivi' }).add(
			player,
			player.dom.getInterfaceContainer(),
			params,
		);
		ToggleUI.add(player, player.dom.getInterfaceContainer(), params);
		ToggleVideo.add(player, params.container.parentElement);
		ToggleThumbnail.add(player, undefined, params);
		ReplayOverlay.add(player, player.dom.getPlayerContainer(), params);
		LearnMore.add(player, player.dom.getPlayerContainer(), params);
	}

	async onDestroy(): Promise<void> {
		this.destroy$.next();
		this.destroy$.complete();
		this.playerRegistry.discard();
	}
}
