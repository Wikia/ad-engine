const svgString = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21.5 22H23v-7h-3v4h-4v3h5.5zM23 3.5V9h-3V5h-4V2h7v1.5zm-22 17V15h3v4h4v3H1v-1.5zM2.5 2H1v7h3V5h4V2H2.5z\" fill-rule=\"evenodd\"/></svg>";

export function getFullscreenOnIcon(classNames: string[] = []) {
    const parser: DOMParser = new window.DOMParser();

    const element: HTMLElement = parser.parseFromString(
        svgString,
        'image/svg+xml',
    ).documentElement;

    element.classList.add('icon');
    classNames.forEach((className) => {
        element.classList.add(className);
    });

    return element;
}
