import { CookieStorageAdapter } from '@wikia/ad-engine';

interface GeoResponse {
	continent_code: string;
	country_code: string;
	region: string;
}

interface GeoData {
	continent: string;
	country: string;
	region: string;
}

export async function ensureGeoCookie(): Promise<void> {
	const cookieAdapter = new CookieStorageAdapter();

	if (cookieAdapter.getItem('Geo')) {
		return;
	}

	try {
		cookieAdapter.setItem('Geo', JSON.stringify(await getGeoData()));
	} catch (e) {
		// do nothing
	}
}

function getGeoData(): Promise<GeoData> {
	const GEO_SERVICE_URL = 'https://services.fandom.com/geoip/location';

	return new Promise<GeoData>((resolve, reject) => {
		try {
			const request = new XMLHttpRequest();

			request.open('GET', GEO_SERVICE_URL, true);
			request.setRequestHeader('Content-type', 'application/json');
			request.timeout = 2000;
			request.withCredentials = true;

			request.onload = () => {
				if (request.status < 200 || request.status >= 300) {
					reject();
				} else {
					const geoResponse: GeoResponse = JSON.parse(request.responseText);

					resolve({
						continent: geoResponse.continent_code,
						country: geoResponse.country_code,
						region: geoResponse.region,
					});
				}
			};

			request.onerror = () => {
				reject();
			};

			request.send();
		} catch (err) {
			reject();
		}
	});
}
