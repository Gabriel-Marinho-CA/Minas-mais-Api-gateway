export type AuthType = {
    success: boolean
    pagination: any
    messages: any
    error: any
    data: {
        user: {
            id: number
            login: string
            password: any
            mobilePhoneNumber: any
            email: any
            cpf: any
            name: string
            lastName: any
            socialName: any
            startDate: string
            endDate: any
            pingDate: string
            gender: any
            birthDate: any
            status: number
            type: number
            requireNewPassword: boolean
            phoneNumber: number
            rg: any
            addressLine: any
            addressZipCode: any
            addressNeighborhood: any
            addressComplement: any
            addressCity: any
            addressState: any
            loginAttemptsNumber: number
            allowMultipleTokens: boolean
            expiresTokenInHours: number
            expiresRefreshTokenInHours: number
            systems: Array<{
                id: number
                userId: number
                user: any
                systemId: number
                system: {
                    id: number
                    name: string
                    token: string
                }
            }>
            permissions: Array<{
                id: number
                userId: number
                user: any
                type: number
                identifier: number
            }>
            securityKey: any
            loginUser: {
                id: number
                lastValidLogin: string
                hasSocialLogin: boolean
                provider: any
                email: any
                keepMeLogged: boolean
                userId: number
                tokenSystem: string
            }
        }
        token: {
            accessToken: string
            expires: string
            refreshToken: string
        }
    }
}

// Client/Industry/Associated - Lista de todos os associados ( programa e seus respectivos produtos )



export type AssociateType = {
    success: boolean
    pagination: {
        page: number
        itemsPerPage: number
        totalItems: number
        totalPages: number
    }
    messages: any
    error: any     
    data: Array<{
        benefit: {
            id: string
            name: string
            siteUrl: string
            phone: string
            allowCustomMembership: boolean
            allowCustomMembershipPDV: boolean
            requiresMembership: boolean
            useEcommerce: boolean
            allowCounterRegistration: boolean
            client: {
                id: string
                name: string
                authenticationDocument: number
            }
            products: Array<{
                name: string
                presentationId: string
                presentation: string
                ean: string
                maximumPrice: number
                salePrice: number
                discountPercent: number
                comboAvailable: boolean
                progressiveDiscount: boolean
                replacementIndustryPrice: number
                replacementPurchasePrice: number
                replacementIndustryDiscount: number
                commercialGradeId: number
                commercialGrade: string
                calculationRuleTypeId: number
                calculationRuleType: number
                discounts: Array<any>
            }>
        }
    }>
}



// Beneficiary/Membership/Exists - 
export type ClientMembershipAndProductExists = {
  success: boolean
  pagination: any
  messages: any
  error: any
  data: {
    membership: boolean
    product: boolean
  }
}
