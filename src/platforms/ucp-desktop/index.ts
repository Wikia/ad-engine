import 'reflect-metadata';
import { container } from 'tsyringe';
import './styles.scss';
import { UcpDesktopPlatform } from './ucp-desktop-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const platform = container.resolve(UcpDesktopPlatform);

	platform.execute();
});
