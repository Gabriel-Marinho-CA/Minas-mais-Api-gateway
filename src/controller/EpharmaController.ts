import { Request, Response } from 'express';
import { epharmaApiService } from "../services/epharmaService";



export class EpharmaController {

    async getToken(req: Request, res: Response) {
        try {
            const token = await epharmaApiService.getAuthHeader();
            return res.json(token);
        } catch (error) {
            console.error('Fail to get token - ', error.message);
        }
    }

    async getAssociate(req: Request, res: Response) {
        const ean_product = req.params.ean;

        try {
            const beneficiary = await epharmaApiService.getProductsInAssociate(ean_product);
            return res.json(beneficiary);
        } catch (error) {
            console.error('Fail to get associate - ', error.message);
        }
    }

    async getClientMembershipExists(req: Request, res: Response) {
        const cpf = req.params.cpf;

        try {
            const client_exist_data_form_fields = await epharmaApiService.handleClientMembershipExistsForm(cpf);

            return res.json(client_exist_data_form_fields);

        } catch (error) {
            console.error('Fail to check if has membership and product to client - ', error.message);
        }
    }


    async sendFormRegisterBeneficiary(formData, res?: Response) {
        try {
            const sendFormResponse = await epharmaApiService.sendBeneficiaryForm(formData);
        } catch (error) {
            console.error('Fail to send register form - ', error.message);
        }
    }

}