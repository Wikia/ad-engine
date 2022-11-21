import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class ComicvineSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			interstitial: {
				defaultSizes: [[1, 1]],
				outOfPage: true,
			},
			'skybox-nav': {
				defaultSizes: [[5, 5]],
				targeting: {
					pos: 'nav',
				},
			},
			leader_plus_top: {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[970, 90],
				],
				targeting: {
					pos: 'top',
				},
			},
			'sky-leader-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos: 'top',
				},
			},
			leader_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos: 'top',
				},
			},
			mpu_top: {
				defaultSizes: [[300, 250]],
				targeting: {
					pos: 'top',
				},
			},
			mpu_bottom: {
				defaultSizes: [[300, 250]],
				targeting: {
					pos: 'bottom',
				},
			},
			leader_bottom: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos: 'bottom',
				},
			},
			overlay_leader_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos: 'top',
				},
			},
			overlay_mpu_top: {
				defaultSizes: [[300, 250]],
				targeting: {
					pos: 'top',
				},
			},
			'native-top': {
				defaultSizes: [
					[11, 11],
					// 'fluid'
				],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-skybox-nav': {
				defaultSizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-native': {
				defaultSizes: [
					[300, 250],
					[11, 11],
					// 'fluid'
				],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-mpu-banner-bottom': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos: 'bottom',
				},
			},
			'mobile-native-plus-top': {
				defaultSizes: [
					[300, 250],
					[11, 11],
					// 'fluid'
				],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-highimpact-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				targeting: {
					pos: 'plus',
				},
			},
			'incontent-mobile-flex': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mobile-banner': {
				defaultSizes: [[320, 50]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
		};

		context.set('slots', slots);
	}
}
