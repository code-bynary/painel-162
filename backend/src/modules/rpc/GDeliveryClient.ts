import net from 'net';
import { PacketWriter } from './PacketWriter';
import { PacketReader } from './PacketReader';
import { Opcodes, Ports } from './Opcodes';
import { PWProtocol } from './PWProtocol';

export interface MailItem {
    id: number;
    pos: number;
    count: number;
    max_count: number;
    data: Buffer;
    proctype: number;
    expire_date: number;
    guid1: number;
    guid2: number;
    mask: number;
}

export class GDeliveryClient {

    sendSysMail(receiverId: number, title: string, context: string, item?: MailItem, money: number = 0): Promise<void> {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            client.connect(Ports.GDelivery, '127.0.0.1', () => {
                const packet = new PacketWriter();
                // SysSendMail (Opcode 0x1076 - decimal 4214)

                // Construct payload based on BWPlay logic:
                // WriteUInt32(1); // Tid?
                // WriteUInt32(32); // SysId?
                // WriteUByte(3); // Type?
                // WriteUInt32(receiver);
                // WriteUString(title);
                // WriteUString(context);
                // GROLEINVENTORY (Item)
                // WriteUInt32(attach_money);

                packet.writeUInt32(1);
                packet.writeUInt32(32);
                packet.writeByte(3);
                packet.writeUInt32(receiverId);
                packet.writeUString(title);
                packet.writeUString(context);

                if (item) {
                    packet.writeUInt32(item.id);
                    packet.writeUInt32(item.pos);
                    packet.writeUInt32(item.count);
                    packet.writeUInt32(item.max_count);
                    packet.writeOctets(item.data);
                    packet.writeUInt32(item.proctype);
                    packet.writeUInt32(item.expire_date);
                    packet.writeUInt32(item.guid1);
                    packet.writeUInt32(item.guid2);
                    packet.writeUInt32(item.mask);
                } else {
                    // Write Empty Item (GRoleInventory structure is 0s)
                    packet.writeUInt32(0); // id
                    packet.writeUInt32(0); // pos
                    packet.writeUInt32(0); // count
                    packet.writeUInt32(0); // max_count
                    packet.writeOctets(Buffer.alloc(0)); // data
                    packet.writeUInt32(0); // proctype
                    packet.writeUInt32(0); // expire
                    packet.writeUInt32(0); // guid1
                    packet.writeUInt32(0); // guid2
                    packet.writeUInt32(0); // mask
                }

                packet.writeUInt32(money);

                const finalData = packet.pack(Opcodes.Game.SendMail);
                client.write(finalData);

                // Delivery usually acknowledges? BWPlay doesn't seem to wait for response on mail, just sends.
                // But usually Delivery sends a Re response.
                // For now, we assume fire-and-forget or short wait.
                setTimeout(() => {
                    client.end();
                    resolve();
                }, 500);
            });

            client.on('error', (err) => reject(err));
        });
    }

    // Example for OnlineList (Opcode 0x160) - Requires complex parsing
    // skipping for now to focus on Mail/Chat as requested first, can be added later.
}
