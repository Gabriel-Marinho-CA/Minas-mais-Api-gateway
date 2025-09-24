import { Request, Response, NextFunction } from 'express';
import { epharmaApiService } from '../services/epharmaApi';

export async function ensureToken(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const header = await epharmaApiService.getAuthHeader();

        if (!header || !header.Authorization) {
            return res.status(401).json({ error: 'Token de autenticação indisponível' });
        }
        next();
    } catch (error) {
        console.error('Error calling auth token')
        return res
            .status(503)
            .json({ error: 'Serviço de autenticação da Epharma indisponível' });
    }
}