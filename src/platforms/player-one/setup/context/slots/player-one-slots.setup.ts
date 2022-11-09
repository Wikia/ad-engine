import { context, DiProcess } from '@wikia/ad-engine';

export class PlayerOneSlotsSetup implements DiProcess {
	execute(): void {
		let activeSlots;
		const site = context.get('custom.site');

		switch (site) {
			case 'metacritic':
				activeSlots = ['leader_plus_top', 'mpu_plus_top'];
				break;
			case 'gamefaqs':
				activeSlots = ['leader_plus_top', 'mpu_top'];
				break;
		}

		activeSlots.map((slotName) => {
			context.push('state.adStack', { id: slotName });
		});
	}
}
