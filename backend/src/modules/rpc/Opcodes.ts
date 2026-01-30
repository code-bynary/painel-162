export const Opcodes = {
    Game: {
        Broadcast: 0x78,
        OnlineList: 0x160,
        SendMail: 0x1076,
        GMAttr: 0x179
    },
    User: {
        Roles: 0xD49,
        RemoveLock: 0x310
    },
    Role: {
        GetRole: 0x1F43,
        GetFaction: 0x11FE,
        GetUserFaction: 0x11FF,
        PutRole: 0x1F42,
        RenameRole: 0xD4C,
        GetRoleId: 0xBD9
    }
};

export const Ports = {
    GDelivery: 29100,
    GProvider: 29300,
    GameDBD: 29400
}
