export function servicesBaseURL() {
	const fandomDomains = ['fandom.com', 'muthead.com', 'futhead.com'];

	return fandomDomains.find((domain) => window.location.hostname.includes(domain))
		? 'https://services.fandom.com/'
		: 'https://services.fandom-dev.' +
				(location.hostname.match(/(?!\.)(pl|us)$/) || ['us'])[0] +
				'/';
}
