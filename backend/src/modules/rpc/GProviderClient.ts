import net from 'net';
import { PacketWriter } from './PacketWriter';
import { Opcodes, Ports } from './Opcodes';

export class GProviderClient {
    private client: net.Socket;

    constructor() {
        this.client = new net.Socket();
    }

    broadcast(message: string, channel: number = 9): Promise<void> {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            client.connect(Ports.GProvider, '127.0.0.1', () => {
                console.log('Connected to GProvider');

                const packet = new PacketWriter();
                packet.writeByte(channel); // Channel (9 = System/Rumor?)
                packet.writeByte(0);       // Emote?
                packet.writeUInt32(0);     // Src RoleID (0 = System)
                packet.writeUString(message);
                packet.writeOctets(Buffer.alloc(0)); // Data?

                // Wrap with Opcode and Length
                const finalData = packet.pack(Opcodes.Game.Broadcast);

                client.write(finalData);
                client.end(); // GProvider usually doesn't reply to broadcast?
                resolve();
            });

            client.on('error', (err) => {
                console.error('GProvider Protocol Error:', err);
                reject(err);
            });
        });
    }
}
