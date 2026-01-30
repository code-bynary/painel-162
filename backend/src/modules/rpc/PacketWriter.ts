import { Buffer } from 'buffer';
import { PWProtocol } from './PWProtocol';

export class PacketWriter {
    public buffer: Buffer;

    constructor() {
        this.buffer = Buffer.alloc(0);
    }

    // Basic Types
    writeByte(value: number) {
        const buf = Buffer.alloc(1);
        buf.writeUInt8(value);
        this.append(buf);
    }

    writeInt32(value: number) {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(value);
        this.append(buf);
    }

    writeUInt32(value: number) {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(value);
        this.append(buf);
    }

    writeFloat(value: number) {
        const buf = Buffer.alloc(4);
        buf.writeFloatLE(value); // PW uses Little Endian for floats usually, checking PHP... 
        // PHP: strrev(pack("f", $value)) -> pack "f" is machine dependent, usually LE on x86. strrev makes it BE? 
        // Wait, 'strrev(pack("f", $value))'. If pack 'f' is LE (standard), rev makes it BE.
        // Let's assume BE for network byte order unless specified otherwise.
        // Marshallizer.php: return strrev(pack("f", $data)); -> If pack("f") is LE, then output is BE.
        buf.writeFloatBE(value);
        this.append(buf);
    }

    // PW Specific
    writeCUInt(value: number) {
        this.append(PWProtocol.writeCUInt(value));
    }

    writeUString(value: string) {
        this.append(PWProtocol.writeUString(value));
    }

    writeOctets(value: Buffer) {
        this.append(PWProtocol.writeOctets(value));
    }

    pack(opcode: number): Buffer {
        const opcodeBuf = PWProtocol.writeCUInt(opcode);
        const lenBuf = PWProtocol.writeCUInt(this.buffer.length);
        return Buffer.concat([opcodeBuf, lenBuf, this.buffer]);
    }

    private append(chunk: Buffer) {
        this.buffer = Buffer.concat([this.buffer, chunk]);
    }
}
