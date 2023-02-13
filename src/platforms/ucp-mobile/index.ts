import { container } from 'tsyringe';
import './styles.scss';
import { UcpMobilePlatform } from './ucp-mobile-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const platform = container.resolve(UcpMobilePlatform);

	platform.execute();
});
