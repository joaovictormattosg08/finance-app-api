import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
        //get acess token in header
        const acessToken = request.headers?.authorization.split('Bearer ')[1]

        if (!acessToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        //check if acess token is valid
        const decodedToken = jwt.verify(
            acessToken,
            process.env.JWT_ACESS_TOKEN_SECRET,
        )

        if (!decodedToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }

        request.userId = decodedToken.userId
        //if token is valid the request can proced
        next()
        //if invalid return a 401
    } catch (error) {
        console.log(error)
        return response.status(401).send({ message: 'Unauthorized' })
    }
}
