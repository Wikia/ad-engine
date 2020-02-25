export function calculateAdHeight(ratio: number): number {
	return (1 / ratio) * document.body.offsetWidth;
}
