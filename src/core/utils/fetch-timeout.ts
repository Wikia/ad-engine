export class FetchTimeout {
	public async fetch(url: string, timeout = 2000, options?: RequestInit): Promise<Response> {
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), timeout);

		const response = await fetch(url, {
			signal: controller.signal,
			...options,
		});
		clearTimeout(id);

		return response;
	}
}
