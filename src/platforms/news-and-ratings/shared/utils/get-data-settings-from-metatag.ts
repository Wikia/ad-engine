export function getDataSettingsFromMetaTag() {
	const adSettingsJson = document.getElementById('ad-settings')?.getAttribute('data-settings');
	this.log('Ad settings: ', adSettingsJson);

	if (!adSettingsJson) {
		return null;
	}

	try {
		return JSON.parse(adSettingsJson);
	} catch (e) {
		this.log('Could not parse JSON');
		return null;
	}
}
