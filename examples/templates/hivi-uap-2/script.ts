import {
	AdEngine,
	AdInfoContext,
	slotPropertiesTrackingMiddleware,
	slotTracker,
	slotTrackingMiddleware,
	TemplateRegistry,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import '../../styles.scss';
import { FirstMockHandler } from './first-mock-handler';
import { SecondMockHandler } from './second-mock-handler';

// Register slot tracker
slotTracker
	.add(slotTrackingMiddleware)
	.add(slotPropertiesTrackingMiddleware)
	.register(({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);
	});

const container = new Container();
const templateRegistry = container.get(TemplateRegistry);

templateRegistry.register(
	'uap-2',
	{
		first: [FirstMockHandler],
		second: [SecondMockHandler],
	},
	'first',
);

templateRegistry.init('uap-2');

new AdEngine().init();
