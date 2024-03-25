const svgString = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><g fill-rule=\"evenodd\"><rect width=\"7\" height=\"22\" rx=\"1\" x=\"3\" y=\"1\"></rect><rect x=\"14\" width=\"7\" height=\"22\" rx=\"1\" y=\"1\"></rect></g></svg>";

export function getPauseIcon(classNames: string[] = []) {
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
