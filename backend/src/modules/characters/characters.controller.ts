import { Request, Response } from 'express';
import pool from '../../config/database';
import { RowDataPacket } from 'mysql2';

export const getUserCharacters = async (req: Request, res: Response) => {
    // req.user is populated by the auth middleware (which we need to create/ensure is used)
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT id, roleid, name, cls, level, gender, reputation 
             FROM pw_users.characters 
             WHERE userid = ? AND status = 1`,
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error fetching characters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
