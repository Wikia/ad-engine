import {
	GalleryLightboxAds,
	GalleryLightboxAdsHandler,
	insertSlots,
	MessageBoxService,
	NativoSlotsDefinitionRepository,
	PlaceholderService,
	QuizSlotsDefinitionRepository,
	slotsContext,
} from '@platforms/shared';
import {
	AdSlot,
	AdSlotEvent,
	AdSlotStatus,
	btfBlockerService,
	communicationService,
	context,
	CookieStorageAdapter,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	Nativo,
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
		private nativoSlotDefinitionRepository: NativoSlotsDefinitionRepository,
		private quizSlotsDefinitionRepository: QuizSlotsDefinitionRepository,
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
			this.nativoSlotDefinitionRepository.getNativoIncontentAdConfig(4),
			this.slotsDefinitionRepository.getTopBoxadConfig(),
			this.slotsDefinitionRepository.getBottomLeaderboardConfig(),
			this.slotsDefinitionRepository.getMobilePrefooterConfig(),
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.nativoSlotDefinitionRepository.getNativoFeedAdConfig({
				slotName: Nativo.FEED_AD_SLOT_NAME,
				anchorSelector: '.recirculation-prefooter',
				insertMethod: 'before',
				classList: ['ntv-ad', AdSlot.HIDDEN_AD_CLASS],
			}),
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
					slot.getPlaceholder()?.classList.remove('is-loading');

					const noTries = 2500;
					const retryTimeout = 500;

					new utils.WaitFor(() => slotImpactWatcher.isAvailable(6), noTries, 0, retryTimeout)
						.until()
						.then(() => {
							slotImpactWatcher.request({
								id: icpSlotName,
								priority: 6,
								breakCallback: () => slot.getPlaceholder()?.classList.add(AdSlot.HIDDEN_AD_CLASS),
							});
							communicationService.emit(eventsRepository.ANYCLIP_LATE_INJECT);
						});
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

				new utils.WaitFor(
					() =>
						window.scrollY > scrollBreakpoint &&
						!playerContainer.querySelector('div.is-on-scroll-active'),
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
		let ntcOverride = false;
		let codePriorityActive = false;
		const disableFloorAdhesion = () => {
			slotService.disable(slotName);
			slotImpactWatcher.disable([slotName]);
			document
				.getElementById('floor_adhesion_anchor')
				?.classList.add('hide', AdSlot.HIDDEN_AD_CLASS);
		};

		communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () => {
			ntcOverride = true;
		});

		slotImpactWatcher.request({
			id: slotName,
			priority: 4,
			breakCallback: disableFloorAdhesion,
		});

		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_COLLAPSE,
			() => slotImpactWatcher.disable([slotName]),
			slotName,
		);
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_FORCED_COLLAPSE,
			() => slotImpactWatcher.disable([slotName]),
			slotName,
		);
		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_SUCCESS,
			() => {
				codePriorityActive = true;

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

				communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_IMPRESSION, () => {
					if (codePriorityActive && !ntcOverride) {
						disableFloorAdhesion();
					}
				});

				communicationService.onSlotEvent(
					AdSlotEvent.CUSTOM_EVENT,
					({ payload }) => {
						if (payload.status === AdSlotEvent.HIDDEN_EVENT) {
							codePriorityActive = false;
							slotImpactWatcher.disable([slotName, 'interstitial']);
						}
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
		const excludedBundleTagName = 'old_incontent_ads';
		const communityExcludedByTag =
			window.fandomContext?.site?.tags?.bundles?.includes(excludedBundleTagName);

		if (this.instantConfig.get('icMobileGalleryAds') && !communityExcludedByTag) {
			if (!this.galleryLightbox.initialized) {
				this.galleryLightbox.handler = new GalleryLightboxAdsHandler(
					this.slotsDefinitionRepository,
				);
				this.galleryLightbox.initialized = true;
			}
			this.galleryLightbox.handler.handle();
		}
	}
}
