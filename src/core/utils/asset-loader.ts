class AssetLoader {
	loadPixel(pixelUrl: string): void {
		const element = document.createElement('img');
		element.src = pixelUrl;
		document.body.appendChild(element);
	}
}

export const assetLoader = new AssetLoader();
