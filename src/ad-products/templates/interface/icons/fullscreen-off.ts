const svgString = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.5 9H8V2H5v4H1v3h4.5zm13 0H16V2h3v4h4v3h-4.5zm-13 6H8v7H5v-4H1v-3h4.5zm13 0H16v7h3v-4h4v-3h-4.5z\" fill-rule=\"evenodd\"/></svg>";

export function getFullscreenOffIcon(classNames: string[] = []) {
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
