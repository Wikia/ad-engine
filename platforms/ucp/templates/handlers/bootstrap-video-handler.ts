import {
	AdSlot,
	createBottomPanel,
	Porvata4Player,
	PorvataTemplateParams,
	ProgressBar,
	ReplayOverlay,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	ToggleThumbnail,
	ToggleUI,
	ToggleVideo,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { fromEvent } from 'rxjs';
import { filter, skip, take } from 'rxjs/operators';
import { PlayerRegistry } from '../helpers/player-registry';

@Injectable()
export class BootstrapVideoHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		private playerRegistry: PlayerRegistry,
	) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		if (!universalAdPackage.isVideoEnabled(this.params)) {
			return;
		}

		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		this.playerRegistry.register();

		this.playerRegistry.video$.pipe(take(1)).subscribe(({ player, params }) => {
			this.handleRestart(player, transition);
			this.handleEvents(player);
			this.adjustUI(player, params);
		});
	}

	/**
	 * Transition to impact when video is restarted
	 */
	private handleRestart(player: Porvata4Player, transition: TemplateTransition<'impact'>): void {
		const restarted$ = fromEvent(player, 'wikiaAdStarted').pipe(skip(1));

		restarted$.subscribe(() => {
			transition('impact', { allowMulticast: true });
			player.unmute();
		});
	}

	private handleEvents(player: Porvata4Player): void {
		player.addEventListener('adCanPlay', () => {
			player.dom.getVideoContainer().classList.remove('hide');
		});
		player.addEventListener('wikiaAdStarted', () => {
			player.addEventListener('wikiaAdCompleted', () => {
				player.reload();
			});
		});

		fromEvent(this.adSlot, AdSlot.CUSTOM_EVENT)
			.pipe(
				filter(
					(event: { status: string }) => event.status === universalAdPackage.SLOT_FORCE_UNSTICK,
				),
			)
			.subscribe(() => player.stop());
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
	}

	async onLeave(): Promise<void> {}
}
