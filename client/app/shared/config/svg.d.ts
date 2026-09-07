/**
 * Allow to `import` a SVG file to get its content as a string, thanks to the `loader` option in `angular.json`.
 */
declare module '*.svg' {
    const content: string;
    export default content;
}
