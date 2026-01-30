import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // req.user is populated by authenticateToken middleware
    const user = (req as any).user;

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }

    next();
};
