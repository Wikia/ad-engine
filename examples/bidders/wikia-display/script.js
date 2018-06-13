import { AdEngine, bidders, context } from '@wikia/ad-engine';
import adContext from '../../context';

context.extend(adContext);

// ToDo: on/off wgVars

// CONFIG DESKTOP
bidders.requestBids({
	config: {
		prebid: {
			aol: {
				enabled: true,
				slots: {
					TOP_LEADERBOARD: {
						sizes: [
							[728, 90]
						],
						placement: '4431497',
						alias: '4431497',
						sizeId: '225'
					},
					TOP_RIGHT_BOXAD: {
						sizes: [
							[300, 250],
							[300, 600]
						],
						placement: '4431473',
						alias: '4431473',
						sizeId: '170'
					}
				}
			},
			appnexus: {
				enabled: true,
				slots: {}
			},
			appnexusAst: {
				enabled: true,
				slots: {
					INCONTENT_PLAYER: {
						placementId: '11543172'
					}
				}
			},
			appnexusWebads: {
				enabled: true,
				slots: {
					TOP_LEADERBOARD: {
						placementId: '13104394',
						sizes: [
							[728, 90],
							[970, 250]
						]
					},
					TOP_RIGHT_BOXAD: {
						placementId: '13104393',
						sizes: [
							[300, 250],
							[300, 600]
						]
					},
					BOTTOM_LEADERBOARD: {
						placementId: '13104395',
						sizes: [
							[728, 90],
							[970, 250]
						]
					},
					INCONTENT_BOXAD_1: {
						placementId: '12939349',
						sizes: [
							[120, 600],
							[160, 600]
						]
					}
				}
			},
			audienceNetwork: {
				enabled: false,
				slots: {}
			},
			beachfront: {
				enabled: true,
				slots: {
					INCONTENT_PLAYER: {
						appId: 'd239e601-dd57-4163-fe5d-35012d77395f'
					}
				}
			},
			indexExchange: {
				enabled: true,
				slots: {
					TOP_LEADERBOARD: {
						sizes: [
							[728, 90],
							[970, 250]
						],
						siteId: '183423'
					},
					TOP_RIGHT_BOXAD: {
						sizes: [
							[300, 250],
							[300, 600]
						],
						siteId: '183567'
					},
					INCONTENT_BOXAD_1: {
						sizes: [
							[160, 600],
							[300, 600],
							[300, 250]
						],
						siteId: '185049'
					},
					BOTTOM_LEADERBOARD: {
						sizes: [
							[728, 90],
							[970, 250]
						],
						siteId: '209250'
					}
				}
			},
			onemobile: {
				enabled: false,
				slots: {}
			},
			openx: {
				enabled: true,
				slots: {
					TOP_LEADERBOARD: {
						sizes: [
							[728, 90],
							[970, 250]
						],
						unit: 538735690
					},
					TOP_RIGHT_BOXAD: {
						sizes: [
							[300, 250],
							[300, 600]
						],
						unit: 538735691
					},
					INCONTENT_BOXAD_1: {
						sizes: [
							[300, 250],
							[300, 600],
							[160, 600]
						],
						unit: 538735697
					},
					BOTTOM_LEADERBOARD: {
						sizes: [
							[728, 90],
							[970, 250]
						],
						unit: 539119447
					}
				}
			},
			pubmatic: {
				enabled: true,
				slots: {
					TOP_LEADERBOARD: {
						sizes: [
							[728, 90],
							[970, 250]
						],
						ids: [
							'/5441/TOP_LEADERBOARD_728x90@728x90',
							'/5441/TOP_LEADERBOARD_970x250@970x250'
						]
					},
					TOP_RIGHT_BOXAD: {
						sizes: [
							[300, 250],
							[300, 600]
						],
						ids: [
							'/5441/TOP_RIGHT_BOXAD_300x250@300x250',
							'/5441/TOP_RIGHT_BOXAD_300x600@300x600'
						]
					},
					BOTTOM_LEADERBOARD: {
						sizes: [
							[728, 90],
							[970, 250]
						],
						ids: [
							'/5441/BOTTOM_LEADERBOARD_728x90@728x90',
							'/5441/BOTTOM_LEADERBOARD_970x250@970x250'
						]
					},
					INCONTENT_BOXAD_1: {
						sizes: [
							[160, 600],
							[300, 600],
							[300, 250]
						],
						ids: [
							'/5441/INCONTENT_BOXAD_1_160x600@160x600',
							'/5441/INCONTENT_BOXAD_1_300x250@300x250',
							'/5441/INCONTENT_BOXAD_1_300x600@300x600'
						]
					}
				}
			},
			rubicon: {
				enabled: true,
				slots: {
					FEATURED: {
						siteId: '147980',
						sizeId: '201',
						zoneId: '699374',
						position: 'btf'
					},
					INCONTENT_PLAYER: {
						siteId: '55412',
						sizeId: '203',
						zoneId: '260296',
						position: 'btf'
					}
				}
			},
			rubiconDisplay: {
				enabled: true,
				slots: {}
			},
			wikia: {
				enabled: true,
				slots: {}
			},
			wikiaVideo: {
				enabled: true,
				slots: {}
			}
		},
		a9: {
			foo: 'bar'
		}
	},
	resetListener: null,
	timeout: 2000
});

// CONFIG MOBILE ===============================================================================
bidders.requestBids({
	config: {
		prebid: {
			aol: {
				enabled: true,
				slots: {
					MOBILE_TOP_LEADERBOARD: {
						sizes: [
							[320, 50]
						],
						placement: '4436772',
						alias: '4436772',
						sizeId: '3055'
					},
					MOBILE_IN_CONTENT: {
						sizes: [
							[300, 250]
						],
						placement: '4431565',
						alias: '4431565',
						sizeId: '170'
					},
					BOTTOM_LEADERBOARD: {
						sizes: [
							[300, 250]
						],
						placement: '4431566',
						alias: '4431566',
						sizeId: '170'
					}
				}
			},
			appnexus: {
				enabled: true,
				slots: {}
			},
			appnexusAst: {
				enabled: true,
				slots: {}
			},
			appnexusWebads: {
				enabled: true,
				slots: {
					/* WIKIA_mLB_AS */
					MOBILE_TOP_LEADERBOARD: {
						placementId: '13104396',
						sizes: [
							[320, 50]
						]
					},
					/* WIKIA_mIC_AS */
					MOBILE_IN_CONTENT: {
						placementId: '13104397',
						sizes: [
							[300, 250],
							[320, 100],
							[320, 50]
						]
					},
					/* WIKIA_BLB_AS */
					BOTTOM_LEADERBOARD: {
						placementId: '13104398',
						sizes: [
							[300, 250],
							[320, 100],
							[320, 50]
						]
					}
				}
			},
			audienceNetwork: {
				enabled: true,
				slots: {
					MOBILE_TOP_LEADERBOARD: {
						sizes: [
							[320, 50]
						],
						placementId: '963689110376230_1245837502161388'
					},
					MOBILE_IN_CONTENT: {
						sizes: [
							[300, 250]
						],
						placementId: '963689110376230_1245838625494609'
					},
					BOTTOM_LEADERBOARD: {
						sizes: [
							[300, 250]
						],
						placementId: '963689110376230_1245839585494513'
					}
				}
			},
			beachfront: {
				enabled: true,
				slots: {
					MOBILE_IN_CONTENT: {
						appId: 'f377a8b1-c5c0-4108-f932-0102a81ff43d'
					}
				}
			},
			indexExchange: {
				enabled: true,
				slots: {
					MOBILE_TOP_LEADERBOARD: {
						sizes: [
							[320, 50]
						],
						siteId: '183568'
					},
					MOBILE_IN_CONTENT: {
						sizes: [
							[300, 250],
							[320, 480]
						],
						siteId: '185055'
					},
					BOTTOM_LEADERBOARD: {
						sizes: [
							[300, 250],
							[320, 50]
						],
						siteId: '185056'
					}
				}
			},
			onemobile: {
				enabled: true,
				slots: {
					MOBILE_TOP_LEADERBOARD: {
						size: [320, 50],
						pos: 'wikia_mw_top_leaderboard_hb'
					},
					MOBILE_IN_CONTENT: {
						size: [300, 250],
						pos: 'wikia_mw_incontent_hb'
					},
					BOTTOM_LEADERBOARD: {
						size: [300, 250],
						pos: 'wikia_mw_pre_footer_hb'
					}
				}
			},
			openx: {
				enabled: true,
				slots: {
					MOBILE_IN_CONTENT: {
						sizes: [
							[300, 250],
							[320, 480]
						],
						unit: 538735699
					},
					BOTTOM_LEADERBOARD: {
						sizes: [
							[300, 250],
							[320, 50]
						],
						unit: 538735700
					},
					MOBILE_TOP_LEADERBOARD: {
						sizes: [
							[320, 50]
						],
						unit: 538735698
					}
				}
			},
			pubmatic: {
				enabled: true,
				slots: {
					MOBILE_TOP_LEADERBOARD: {
						sizes: [
							[320, 50]
						],
						ids: [
							'/5441/MOBILE_TOP_LEADERBOARD_320x50@320x50'
						]
					},
					MOBILE_IN_CONTENT: {
						sizes: [
							[300, 250],
							[320, 480]
						],
						ids: [
							'/5441/MOBILE_IN_CONTENT_300x250@300x250',
							'/5441/MOBILE_IN_CONTENT_320x480@320x480'
						]
					},
					BOTTOM_LEADERBOARD: {
						sizes: [
							[300, 250],
							[320, 50]
						],
						ids: [
							'/5441/MOBILE_PREFOOTER_300x250@300x250',
							'/5441/MOBILE_PREFOOTER_320x50@320x50'
						]
					}
				}
			},
			rubicon: {
				enabled: true,
				slots: {
					FEATURED: {
						siteId: '147980',
						sizeId: '201',
						zoneId: '699374',
						position: 'btf'
					},
					MOBILE_IN_CONTENT: {
						siteId: '55412',
						sizeId: '203',
						zoneId: '563110',
						position: 'btf'
					}
				}
			},
			rubiconDisplay: {
				enabled: true,
				slots: {}
			},
			wikia: {
				enabled: true,
				slots: {}
			},
			wikiaVideo: {
				enabled: true,
				slots: {}
			}
		},
		a9: {
			foo: 'bar'
		}
	},
	resetListener: null,
	timeout: 2000
});

new AdEngine().init();
