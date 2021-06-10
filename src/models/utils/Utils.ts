import {ID, Nullable} from './UtilityTypes';
import {IDParseError} from '../../exceptions/IDParseError';

export function assertStringID(id: Nullable<ID>, error: Error = new IDParseError()): string {
    if (!id) throw error;
    return id.toString();
}

/**
 * Delays
 * @param time in ms
 */
export function sleep(time: number): Promise<void> {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

export function joinLink(path: string, base: string | URL): string {
    return new URL(path, base).href;
}

/**
 * Capitalizes first letters of words in string.
 * @param {string} str String to be modified
 * @param {boolean=false} lower Whether all other letters should be lowercased
 * @return {string}
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
 */
export function capitalize(str: string, lower: boolean = false): string {
    return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
}
