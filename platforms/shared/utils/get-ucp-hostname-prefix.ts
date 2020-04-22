export function getUcpHostnamePrefix(): string {
	const hostname = window.location.hostname.toLowerCase();
	const match = /(^|.)(showcase|externaltest|preview|verify|stable|sandbox-[^.]+)\./.exec(hostname);

	if (match && match.length > 2) {
		return match[2];
	}

	const pieces = hostname.split('.');

	if (pieces.length) {
		return pieces[0];
	}

	return undefined;
}
