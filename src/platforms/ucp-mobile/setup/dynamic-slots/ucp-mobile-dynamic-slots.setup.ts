import {
	GalleryLightboxAds,
	GalleryLightboxAdsHandler,
	insertSlots,
	MessageBoxService,
	PlaceholderService,
	QuizSlotsDefinitionRepository,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	AdSlotEvent,
	AdSlotStatus,
	Anyclip,
	btfBlockerService,
	communicationService,
	Connatix,
	context,
	CookieStorageAdapter,
	DiProcess,
	eventsRepository,
	globalContextService,
	InstantConfigService,
	slotImpactWatcher,
	slotService,
	UapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UcpMobileSlotsDefinitionRepository } from './ucp-mobile-slots-definition-repository';

@Injectable()
export class UcpMobileDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotsDefinitionRepository: UcpMobileSlotsDefinitionRepository,
		private quizSlotsDefinitionRepository: QuizSlotsDefinitionRepository,
		private anyclip: Anyclip,
		private connatix: Connatix,
		private galleryLightbox: GalleryLightboxAds,
		protected instantConfig: InstantConfigService,
	) {}

	execute(): void {
		this.injectSlots();
		this.configureTopLeaderboardAndCompanions();
		this.configureIncontents();
		this.configureInterstitial();
		this.registerFloorAdhesionCodePriority();
		this.registerAdPlaceholderService();
		this.handleMobileGalleryLightboxAdsSlots();
	}

	private injectSlots(): void {
		const topLeaderboardDefinition = this.slotsDefinitionRepository.getTopLeaderboardConfig();

		insertSlots([
			topLeaderboardDefinition,
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getMobilePrefooterConfig(),
			this.slotsDefinitionRepository.getInterstitialConfig(),
		]);

		if (context.get('custom.hasFeaturedVideo')) {
			this.waitForFloorAdhesionInjection();
		} else {
			insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
		}

		if (!topLeaderboardDefinition) {
			communicationService.on(eventsRepository.AD_ENGINE_STACK_START, () => {
				btfBlockerService.finishFirstCall();
				communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
					isLoaded: universalAdPackage.isFanTakeoverLoaded(),
					adProduct: universalAdPackage.getType(),
				});
			});
		}

		communicationService.on(
			eventsRepository.QUIZ_AD_INJECTED,
			(payload) => {
				insertSlots([this.quizSlotsDefinitionRepository.getQuizAdConfig(payload.slotId)]);
			},
			false,
		);
	}

	private configureTopLeaderboardAndCompanions(): void {
		if (
			!context.get('custom.hasFeaturedVideo') &&
			context.get('wiki.targeting.pageType') !== 'search'
		) {
			slotsContext.addSlotSize(
				'top_leaderboard',
				universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile,
			);
			slotsContext.addSlotSize(
				'top_leaderboard',
				universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.unified,
			);

			context.push('slots.top_leaderboard.defaultTemplates', 'stickyTlb');
		}

		slotsContext.addSlotSize(
			'top_boxad',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
		);
		slotsContext.addSlotSize(
			'incontent_boxad_1',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
		);
		slotsContext.addSlotSize(
			'mobile_prefooter',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
		);
	}

	private configureIncontents(): void {
		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (!action.isLoaded) {
				insertSlots([this.slotsDefinitionRepository.getIncontentPlayerConfig()]);
			}

			insertSlots([this.slotsDefinitionRepository.getIncontentBoxadConfig()]);
		});

		const icpSlotName = 'incontent_player';

		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				if (slot.getSlotName() === icpSlotName) {
					communicationService.emit(eventsRepository.ANYCLIP_LATE_INJECT);
					communicationService.emit(eventsRepository.CONNATIX_LATE_INJECT);
					slot.getPlaceholder()?.classList.remove('is-loading');
				}
			},
			false,
		);
	}

	private configureInterstitial(): void {
		const setInterstitialCapping = () => {
			const cookieAdapter = new CookieStorageAdapter();
			cookieAdapter.setItem('_ae_intrsttl_imp', '1');
		};

		communicationService.onSlotEvent(
			AdSlotEvent.SLOT_VIEWED_EVENT,
			() => {
				communicationService.emit(eventsRepository.AD_ENGINE_INTERSTITIAL_DISPLAYED);
				setInterstitialCapping();
			},
			'interstitial',
		);

		communicationService.on(eventsRepository.GAM_INTERSTITIAL_LOADED, () => {
			setInterstitialCapping();
		});
	}

	private waitForFloorAdhesionInjection(): void {
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_SUCCESS,
			() => {
				const playerContainer = document.getElementById('featured-video__player-container');

				if (!playerContainer) {
					return;
				}

				const noTries = 2500;
				const retryTimeout = 500;
				const scrollInterval = 100;
				const scrollBreakpoint = (playerContainer.offsetTop || 0) + scrollInterval;

				// TODO: this is hacky solution to wait for floating featured video player to be closed, we should use communicationService event instead
				// ticket to fix it: https://fandom.atlassian.net/browse/COTECH-963
				new utils.WaitFor(
					() =>
						window.scrollY > scrollBreakpoint &&
						!playerContainer.querySelector('div.is-on-scroll-active, .cnx-float'),
					noTries,
					0,
					retryTimeout,
				)
					.until()
					.then(() => {
						insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
					});
			},
			'featured',
			true,
		);
	}

	private registerFloorAdhesionCodePriority(): void {
		const slotName = 'floor_adhesion';
		let codePriorityActive = false;
		let anyclipLoaded = false;
		let connatixLoaded = false;

		const enableAnyclipFloating = () => {
			if (!anyclipLoaded) return;
			this.anyclip.enableFloating();
		};

		const disableAnyclipFloating = () => {
			if (!anyclipLoaded) return;
			this.anyclip.disableFloating();
		};

		const enableConnatixFloating = () => {
			if (!connatixLoaded) return;
			this.connatix.enableFloating();
		};

		const disableConnatixFloating = () => {
			if (!connatixLoaded) return;
			this.connatix.disableFloating();
		};

		const hideFloorAdhesionAnchor = () => {
			document
				.getElementById('floor_adhesion_anchor')
				?.classList.add('hide', AdSlot.HIDDEN_AD_CLASS);
		};

		const disableFloorAdhesion = () => {
			slotService.disable(slotName);
			slotImpactWatcher.disable([slotName]);
			hideFloorAdhesionAnchor();
			enableAnyclipFloating();
		};

		slotImpactWatcher.request({
			id: slotName,
			priority: 4,
			breakCallback: disableFloorAdhesion,
		});

		communicationService.on(eventsRepository.ANYCLIP_READY, () => {
			anyclipLoaded = true;

			if (codePriorityActive) {
				disableAnyclipFloating();
			}
		});

		communicationService.on(eventsRepository.CONNATIX_READY, () => {
			connatixLoaded = true;

			if (codePriorityActive) {
				disableConnatixFloating();
			}
		});

		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_COLLAPSE,
			() => {
				slotImpactWatcher.disable([slotName]);
				hideFloorAdhesionAnchor();
				enableAnyclipFloating();
				enableConnatixFloating();
			},
			slotName,
		);
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_FORCED_COLLAPSE,
			() => {
				slotImpactWatcher.disable([slotName]);
				hideFloorAdhesionAnchor();
				enableAnyclipFloating();
				enableConnatixFloating();
			},
			slotName,
		);
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_SUCCESS,
			() => {
				codePriorityActive = true;
				disableAnyclipFloating();
				disableConnatixFloating();

				communicationService.on(
					eventsRepository.AD_ENGINE_INTERSTITIAL_DISPLAYED,
					() => {
						if (!codePriorityActive) {
							return;
						}

						slotImpactWatcher.request({
							id: 'interstitial',
							priority: 2,
						});
					},
					false,
				);

				communicationService.onSlotEvent(
					AdSlotEvent.CUSTOM_EVENT,
					({ payload }) => {
						if (payload.status !== AdSlotEvent.HIDDEN_EVENT) {
							return;
						}

						codePriorityActive = false;
						slotImpactWatcher.disable([slotName, 'interstitial']);
					},
					slotName,
				);
			},
			slotName,
		);
	}

	private registerAdPlaceholderService(): void {
		const messageBoxService = new MessageBoxService(context.get('services.messageBox.enabled'));
		const placeholderService = new PlaceholderService(messageBoxService);
		placeholderService.init();
	}

	private handleMobileGalleryLightboxAdsSlots(): void {
		const excludedBundleTagName = 'sensitive';
		const communityExcludedByTag = globalContextService.hasBundle(excludedBundleTagName);

		if (this.instantConfig.get('icMobileGalleryAds') && !communityExcludedByTag) {
			if (!this.galleryLightbox.initialized) {
				this.galleryLightbox.handler = new GalleryLightboxAdsHandler();
				this.galleryLightbox.initialized = true;
			}
			this.galleryLightbox.handler.handle();
		}
	}
}
