import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class ComicvineA9ConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.a9.slots', this.getA9Context());
	}

	private getA9Context(): object {
		const desktopSlots = {
			leader_plus_top: {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'sky-leader-plus-top': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			leader_top: {
				sizes: [[728, 90]],
			},
			mpu_top: {
				sizes: [[300, 250]],
			},
			mpu_bottom: {
				sizes: [[300, 250]],
			},
			leader_bottom: {
				sizes: [[728, 90]],
			},
			overlay_leader_top: {
				sizes: [[728, 90]],
			},
			overlay_mpu_top: {
				sizes: [[300, 250]],
			},
		};

		const mobileSlots = {
			'mobile-native': {
				sizes: [[300, 250]],
			},
			'mobile-mpu-banner-bottom': {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			'mobile-native-plus-top': {
				sizes: [[300, 250]],
			},
			'mobile-highimpact-plus': {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			'incontent-mobile-flex': {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			'mobile-banner': {
				sizes: [[300, 250]],
			},
		};

		return context.get('state.isMobile') ? mobileSlots : desktopSlots;
	}
}
