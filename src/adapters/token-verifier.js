import jwt from 'jsonwebtoken'

export class tokenVerifierAdapter {
     execute(token, secret) {
        return jwt.verify(token, secret)
    }
}
