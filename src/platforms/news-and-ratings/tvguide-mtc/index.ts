import { Container } from '@wikia/dependency-injection';
import { TvGuideMTCContextSetup } from './setup/wiki-context.setup';
import './styles.scss';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(TvGuideMTCContextSetup);

	platform.execute();
});
