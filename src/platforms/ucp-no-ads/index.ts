import { container } from 'tsyringe';
import './styles.scss';
import { UcpNoAdsPlatform } from './ucp-no-ads-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const platform = container.resolve(UcpNoAdsPlatform);

	platform.execute();
});
