import { Buffer } from 'buffer';
import { PWProtocol } from './PWProtocol';

export class PacketReader {
    public buffer: Buffer;
    public offset: number;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
        this.offset = 0;
    }

    readByte(): number {
        const value = this.buffer.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }

    readInt32(): number {
        const value = this.buffer.readInt32BE(this.offset);
        this.offset += 4;
        return value;
    }

    readUInt32(): number {
        const value = this.buffer.readUInt32BE(this.offset);
        this.offset += 4;
        return value;
    }

    readFloat(): number {
        const value = this.buffer.readFloatBE(this.offset);
        this.offset += 4;
        return value;
    }

    readCUInt(): number {
        const { value, length } = PWProtocol.readCUInt(this.buffer, this.offset);
        this.offset += length;
        return value;
    }

    readUString(): string {
        const { value, length } = PWProtocol.readUString(this.buffer, this.offset);
        this.offset += length;
        return value;
    }

    readOctets(): Buffer {
        const { value, length } = PWProtocol.readOctets(this.buffer, this.offset);
        this.offset += length;
        return value;
    }

    // specific for unpacking strings that are just octets in disguise
    readString(): string {
        const { value } = PWProtocol.readUString(this.buffer, this.offset);
        // Often just calling readUString is enough if it matches standard structure
        return this.readUString();
    }
}
