/**
 * Converts a dash or snake-case string to camel case.
 */

function camelCase(input: string): string {
    return input.match(/[_-]/) ?
        input.replace(/([_-][a-z0-9])/g, $1 => $1.toUpperCase().replace(/[_-]/, '')) :
        input.charAt(0).toLowerCase() + input.slice(1)
}

export default camelCase;
