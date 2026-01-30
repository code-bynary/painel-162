import { Buffer } from 'buffer';

export class PWProtocol {

    // Compact UInt (CUInt) - Variable length integer
    static writeCUInt(value: number): Buffer {
        if (value < 0x80) {
            return Buffer.from([value]);
        } else if (value < 0x4000) {
            const buf = Buffer.alloc(2);
            buf.writeUInt16BE(value | 0x8000);
            return buf;
        } else if (value < 0x20000000) {
            const buf = Buffer.alloc(4);
            buf.writeUInt32BE(value | 0xC0000000);
            return buf;
        } else {
            const buf = Buffer.alloc(5);
            buf.writeUInt8(0xE0, 0);
            buf.writeUInt32BE(value, 1);
            return buf;
        }
    }

    static readCUInt(buffer: Buffer, offset: number = 0): { value: number, length: number } {
        const byte = buffer.readUInt8(offset);

        if (byte < 0x80) {
            return { value: byte, length: 1 };
        } else if ((byte & 0xE0) === 0xC0) {
            // 4 bytes case (0xC0 header)
            return { value: buffer.readUInt32BE(offset) & 0x1FFFFFFF, length: 4 };
        } else if ((byte & 0xF0) === 0xE0) {
            // 5 bytes case (0xE0 header)
            return { value: buffer.readUInt32BE(offset + 1), length: 5 };
        } else if ((byte & 0x80) === 0x80) {
            // 2 bytes case (0x80 header) -> Check this last to avoid conflict with 0xC0/0xE0 if logic is loose
            return { value: buffer.readUInt16BE(offset) & 0x3FFF, length: 2 };
        }

        return { value: 0, length: 0 }; // Should not happen
    }

    // UString: CUInt Length + UTF-16LE Bytes
    static writeUString(value: string): Buffer {
        const strBuf = Buffer.from(value, 'utf16le');
        const lenBuf = this.writeCUInt(strBuf.length);
        return Buffer.concat([lenBuf, strBuf]);
    }

    static readUString(buffer: Buffer, offset: number): { value: string, length: number } {
        const { value: strLen, length: lenSize } = this.readCUInt(buffer, offset);
        const strValue = buffer.toString('utf16le', offset + lenSize, offset + lenSize + strLen);
        return { value: strValue, length: lenSize + strLen };
    }

    // Octets: CUInt Length + Raw Bytes
    static writeOctets(value: Buffer): Buffer {
        const lenBuf = this.writeCUInt(value.length);
        return Buffer.concat([lenBuf, value]);
    }

    static readOctets(buffer: Buffer, offset: number): { value: Buffer, length: number } {
        const { value: octetLen, length: lenSize } = this.readCUInt(buffer, offset);
        const octetValue = buffer.subarray(offset + lenSize, offset + lenSize + octetLen);
        return { value: octetValue, length: lenSize + octetLen };
    }
}
