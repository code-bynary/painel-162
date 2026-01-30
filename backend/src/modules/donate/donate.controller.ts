import { Request, Response } from 'express';
import pool from '../../config/database';
import { RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

export const getPackages = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM pw_users.donate_packages');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createPayment = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { packageId } = req.body;

    if (!userId || !packageId) {
        return res.status(400).json({ message: 'Missing user ID or package ID' });
    }

    const transactionId = uuidv4();

    try {
        await pool.execute(
            'INSERT INTO pw_users.donate_transactions (id, userid, package_id, status) VALUES (?, ?, ?, ?)',
            [transactionId, userId, packageId, 'pending']
        );

        // Mock payment URL (in a real app, this would be MercadoPago/Stripe URL)
        // Here we return a local URL to "confirm" the payment for testing.
        const mockPaymentUrl = `http://localhost:3000/api/donate/confirm-mock/${transactionId}`;

        res.json({
            transactionId,
            paymentUrl: mockPaymentUrl,
            message: 'Transaction created. Use the paymentUrl to simulate payment confirmation.'
        });

    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const confirmMockPayment = async (req: Request, res: Response) => {
    const { transactionId } = req.params;

    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM pw_users.donate_transactions WHERE id = ?',
            [transactionId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const transaction = rows[0];

        if (transaction.status === 'delivered') {
            return res.json({ message: 'Transaction already delivered' });
        }

        // Update transaction status
        await pool.execute(
            'UPDATE pw_users.donate_transactions SET status = ? WHERE id = ?',
            ['approved', transactionId]
        );

        // TODO: Delivery logic (Add Gold to user account via gdeliveryd or database)
        // For now, we just mark as delivered for the mock.
        await pool.execute(
            'UPDATE pw_users.donate_transactions SET status = ? WHERE id = ?',
            ['delivered', transactionId]
        );


        res.json({ message: `Payment confirmed for transaction ${transactionId}. Gold would be delivered here.` });

    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
