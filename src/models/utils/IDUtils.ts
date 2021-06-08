import base32Encode from 'base32-encode';
import base32Decode from 'base32-decode';
import FlakeId from 'flake-idgen';
import {IDParseError} from '../../exceptions/IDParseError';
import {DateTime} from 'luxon';
import * as crypto from 'crypto';
import {ID} from '@models/utils/UtilityTypes';
import {Buffer} from 'buffer';

export abstract class IDUtils {
    public static readonly STATIC_ID = 1;

    private static readonly ID_GENERATOR = new FlakeId({ datacenter: 1, worker: 1 }); // TODO
    private static readonly MAX_ID_LENGTH = 16;

    /**
     * Returns an 8 Byte hex string - the ID
     */
    public static generateID(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            IDUtils.ID_GENERATOR.next((err, id) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(IDUtils.bufferToString(id));
            });
        })
    }

    /**
     * Returns a B32 random encoded string
     * @param l
     */
    public static randomString(l: number): string {
        return this.encodeB32Buffer(crypto.randomBytes(l));
    }

    /**
     * Returns a B32 encoded string
     * @param s
     */
    public static encodeB32(s: string): string {
        return this.encodeB32Buffer(IDUtils.stringToBuffer(s));
    }

    /**
     * Returns a B32 encoded string
     * @param b
     */
    public static encodeB32Buffer(b: Buffer): string {
        return base32Encode(b, 'Crockford');
    }

    /**
     * Returns a B32 encoded ID
     * @param id
     */
    public static encodeID(id: bigint | string): string {
        let buffer = Buffer.alloc(8);

        if (typeof id === 'string') {
            if (!id.startsWith('0x') || !id.startsWith('0X'))
                buffer.writeBigUInt64BE(BigInt(`0x${id}`));
            else
                buffer.writeBigUInt64BE(BigInt(id));
        } else {
            buffer.writeBigUInt64BE(id);
        }

        return this.encodeB32Buffer(buffer);
    }

    /**
     * Decodes a B32 encoded string and returns a hex string
     * @param s
     * @param encoding
     */
    public static decodeB32(s: string, encoding: BufferEncoding = 'hex'): string {
        return IDUtils.bufferToString(Buffer.from(base32Decode(s, 'Crockford')), encoding);
    }

    /**
     * Decodes a B32 encoded ID and returns a bigint id
     * @param id
     */
    public static decodeID(id: ID): TID {
        if (typeof id === 'number')
            return BigInt(id);

        let s = IDUtils.decodeB32(id);
        if (s.length > IDUtils.MAX_ID_LENGTH)
            throw new IDParseError();

        return IDUtils.IDToNumber(s);
    }

    /**
     * Extracts timestamp for an already decoded id
     * @param id
     */
    public static extractTimestamp(id: TID): DateTime {
        let b: Buffer;

        if (typeof id === 'string') {
            b = IDUtils.stringToBuffer(id);
        } else {
            b = IDUtils.stringToBuffer(id.toString(16));
        }

        if (b.length > IDUtils.MAX_ID_LENGTH / 2)
            throw new IDParseError();

        return DateTime.fromMillis(Number(Buffer.from([
            0,
            0,
            (b[0] >> 6) & 0xFF,
            ((b[0] << 2) | (b[1] >> 6)) & 0xFF,
            ((b[1] << 2) | (b[2] >> 6)) & 0xFF,
            ((b[2] << 2) | (b[3] >> 6)) & 0xFF,
            ((b[3] << 2) | (b[4] >> 6)) & 0xFF,
            ((b[4] << 2) | (b[5] >> 6)) & 0xFF,
        ]).readBigUInt64BE()));
    }

    public static IDToNumber(id: string, isHex: boolean = true): bigint {
        // Cassandra bigint type is bugged and treats all numbers as signed ones
        return isHex ? BigInt(`0x${id}`) : BigInt(id);
    }

    private static stringToBuffer(s: string): Buffer {
        return Buffer.from(s, 'hex');
    }

    private static bufferToString(hex: Buffer, encoding: BufferEncoding = 'hex'): string {
        return hex.toString(encoding);
    }
}

export type TID = bigint;
