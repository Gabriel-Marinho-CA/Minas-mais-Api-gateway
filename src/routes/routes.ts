import { Router } from 'express';
import { EpharmaController } from '../controller/EpharmaController';
import { ensureToken } from '../middleware/ensureToken';

const router = Router();
const controller = new EpharmaController();

router.get('/get-token-epharma', ensureToken, controller.getToken.bind(controller));
router.get('/get-product-associate/:ean', ensureToken, controller.getAssociate.bind(controller));
router.get('/get-client-membership-exist/:cpf', ensureToken, controller.getClientMembershipExists.bind(controller));

router.post('/send-beneficiary-register', ensureToken, (req) => controller.sendFormRegisterBeneficiary(req.body));



export default router;