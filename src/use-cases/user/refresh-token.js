import { UnauthorizedError } from '../../errors/user.js'
export class RefreshTokenUseCase {
    constructor(tokensGeneratorAdapter, tokenVerifierAdapter) {
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    execute(refreshToken) {
        // verificar se o refreshToken é válido
        try {
            const decodedToken = this.tokenVerifierAdapter.execute(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET,
            )
            console.log(decodedToken)
            if (!decodedToken) {
                throw new UnauthorizedError()
            }
            const tokens = this.tokensGeneratorAdapter.execute(
                decodedToken.userId,
            )

            console.log('tokens:', tokens)

            return tokens
        } catch (error) {
            console.error(error)
            throw new UnauthorizedError()
        }
    }
}
