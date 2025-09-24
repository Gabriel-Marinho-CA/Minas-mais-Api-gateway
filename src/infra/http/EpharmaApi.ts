import axios, { AxiosInstance } from "axios";
import { AssociateType, AuthType, ClientMembershipAndProductExists } from "../../types/types";
import { Response, Request } from 'express';

export class EPharmaAPI {

    /**
     * - Authentication – 
     * Para gerar o token de uso dos demais endpoint;
     * 
     * DOC: https://documenter.getpostman.com/view/16776555/2s9YeD8YEq#eae31485-4e01-4611-bb9e-60def9ac46ef
    */

    private token: string | null = null;
    private expiresAt: number | null = null;
    private http: AxiosInstance;
    private benefit_id: string | undefined = undefined;
    private ean: number | string | null = null;

    private requiresMembership: boolean | undefined = false;
    private allowCustomMembership: boolean | undefined = false;

    constructor() {
        this.http = axios.create({ baseURL: process.env.API_HOST });
    }

    private async refreshToken() {
        const { data: { data } } = await this.http.get<AuthType>(process.env.API_AUTH_ROUTE!, {
            headers: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD,
                client_id: process.env.API_CLIENT_ID
            },
        });

        this.token = data.token.accessToken;
        this.expiresAt = new Date(data.token.expires).getTime();
    }

    async getAuthHeader() {
        try {
            if (!this.token || (this.expiresAt && Date.now() >= this.expiresAt)) {

                await this.refreshToken();
                return { Authorization: `Bearer ${this.token}` };

            }
        } catch (error) {
            console.error('Erro ao obter token:', error.message);
            throw error;
        }

    }


    /**
     * - Client/Industry/Associated - 
     * Realizar a consulta dos programas da indústria disponíveis na epharma, bem como seus produtos participantes e descontos mínimos garantidos.
     * 
     * DOC: https://documenter.getpostman.com/view/16776555/2s9YeD8YEq#9bb42797-d8f1-44de-bbc7-da2b23ac1191
    */


    // Em tese aqui entra a rotina de armazenamento dos produtos por beneficiario ( lista muito grande), então aqui o ideal seria consultar no BD.


    // async getAssociate() {
    //     const { data }:AssociateType = await this.http.get<AssociateType>(`${process.env.API_GET_ASSOCIATE_LIST}/${process.env.API_CNPJ_TEST}`,
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${this.token}`,
    //             },
    //         }
    //     )

    //     // Será 1 ou varios beneficios?

    //     return data;
    // }

    async getProductsInAssociate(ean_product) {
        // Faz um get para o bd 
        const { data }: AssociateType = axios.get('BD');
        const benefitFound = data.find(({ benefit }) =>
            benefit.products.some(product => product.ean === ean_product)
        );

        this.benefit_id = benefitFound?.benefit.id;
        this.ean = ean_product;

        return benefitFound;
    }

    /**
     * - Beneficiary/Membership/Exists - 
     * Consultar se o beneficiário já está cadastrado no programa em que o produto faz parte e se exige a adesão do beneficiário para a aquisição dele.
     * 
     * DOC: https://documenter.getpostman.com/view/16776555/2s9YeD8YEq#718dc8f3-b57c-45d4-97e9-707f2d3fb274
     */

    async handleClientMembershipExistsForm(cpf: string) {
        try {

            const { data: { data: { membership, product } } } = await this.http.get<ClientMembershipAndProductExists>(`${process.env.API_GET_BENEFICIARY_MEMBERSHIP_EXISTS}/${this.benefit_id}/${cpf}/${this.ean}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                }
            );

            this.requiresMembership = membership;
            this.allowCustomMembership = product;

            if (!membership || !product) {
                const formFields = await this.generateFormRegisterBeneficiary();

                return formFields;

            }


        } catch (error) {
            console.error('Error trying to get client membership -', error.message);
            throw error;
        }



    }

    /**
     * - Beneficiary/Register/Configuration -
     * Consultar as configurações de cadastro do beneficiário para benefícios que permitem o cadastro de via integração.
     * 
     * DOC: https://documenter.getpostman.com/view/16776555/2s9YeD8YEq#718dc8f3-b57c-45d4-97e9-707f2d3fb274
     */

    async generateFormRegisterBeneficiary() {

        // .env = API_GET_BENEFICIARY_FORM_REGISTER_FIELDS = /Client/api/v1/Benefit/Beneficiary/Register/Configuration/  #{benefit_id}}?eans={{EAN}}

        try {
            const { data } = await axios.get<any>(`${process.env.API_GET_BENEFIARY_FORM_REGISTER_FIELDS}/${this.benefit_id}?eans=${this.ean}`);


            return data;

        } catch (error) {
            console.error('Error trying to get form fields', error.message);
            throw error;
        }

    }

    async sendBeneficiaryForm() {

        // .env API_POST_BENEFICIARY_FORM = /Beneficiary/api/v1/Beneficiary/Dynamic/  # {{benefit_id}}?messaging=true

        try {
            const data = await axios.post(`${process.env.API_POST_BENEFICIARY_FORM}/${this.benefit_id}?messaging=true`, formData);

            return true;

        } catch (error) {
            console.error('Error sending form beneficiary', error.message);
            throw error;
        }
    }
}

