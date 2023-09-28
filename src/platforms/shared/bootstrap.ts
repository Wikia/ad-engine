import { logVersion } from '@wikia/ad-engine';
import { ensureGeoCookie } from './ensure-geo-cookie';

export async function bootstrap(): Promise<void> {
	logVersion();

	await ensureGeoCookie();
}
