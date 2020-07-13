import { AdEngine, TemplateRegistry } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import '../../styles.scss';
import { FirstMockHandler } from './first-mock-handler';
import { SecondMockHandler } from './second-mock-handler';

const container = new Container();
const templateRegistry = container.get(TemplateRegistry);

(window as any).gcTest = new WeakMap();

templateRegistry.register(
	'uap-2',
	{
		first: [FirstMockHandler],
		second: [SecondMockHandler],
	},
	'first',
);

document.getElementById('init-button').addEventListener('click', () => {
	templateRegistry.init('uap-2', { name: 'slot name' } as any, { slotName: 'I do not know' });
});

document.getElementById('destroy-button').addEventListener('click', () => {
	templateRegistry.destroyAll();
});

new AdEngine().init();
