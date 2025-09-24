import axios, { AxiosInstance } from "axios";
import { AssociateType, AuthType, ClientMembershipAndProductExists } from "../../types/types";

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
    private benefit_id: number | string | null = null;
    private ean: number | string | null = null;

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
        const data = axios.get('BD');
        const benefitFound = data.find(({ benefit }) =>
            benefit.products.some(product => product.ean === ean_product)
        );

        this.benefit_id = benefitFound.id;
        this.ean = benefitFound

        return benefitFound;
    }

    /**
     * - Beneficiary/Membership/Exists - 
     * Consultar se o beneficiário já está cadastrado no programa em que o produto faz parte e se exige a adesão do beneficiário para a aquisição dele.
     * 
     * DOC: https://documenter.getpostman.com/view/16776555/2s9YeD8YEq#718dc8f3-b57c-45d4-97e9-707f2d3fb274
     */

    async getClientMembershipExists(cpf: string) {
        const { data: { data: { membership, product } } } = await this.http.get<ClientMembershipAndProductExists>(`${process.env.API_GET_BENEFICIARY_MEMBERSHIP_EXISTS}/${this.benefit_id}/${cpf}/${this.ean}`,
            {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            }
        )

        const apiImportantInfo = {
            hasMemership: membership,
            productIsEnableToClientOrNeedSignUp: product
        }

        return apiImportantInfo;
    }
}

