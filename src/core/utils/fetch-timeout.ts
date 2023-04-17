export async function fetchTimeout(url: string, timeout = 2000): Promise<Response> {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	const response = await fetch(url, {
		signal: controller.signal,
	});
	clearTimeout(id);

	return response;
}
