import { AdEngine, TemplateRegistry } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import '../../styles.scss';
import { FirstMockHandler } from './first-mock-handler';
import { SecondMockHandler } from './second-mock-handler';

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
templateRegistry.register(
	'uap-2-copy',
	{
		first: [FirstMockHandler],
		second: [SecondMockHandler],
	},
	'first',
);

templateRegistry.init('uap-2', { name: 'slot name' } as any, { slotName: 'I do not know' });
// templateRegistry.init('uap-2-copy', { name: 'another slot' } as any, {
// 	slotName: 'another params',
// });

new AdEngine().init();
