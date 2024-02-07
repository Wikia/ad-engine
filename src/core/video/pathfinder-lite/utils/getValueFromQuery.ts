export default function getValueFromQuery(name: string, defaultValue?: string): string {
	const searchParams = new URLSearchParams(window?.location.search);
	if (!searchParams.has(name)) {
		return defaultValue ?? '';
	}

	return searchParams.get(name) ?? '';
}
