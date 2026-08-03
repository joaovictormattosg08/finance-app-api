export const badRequest = (body) => {
    return {
        statusCode: 400,
        body,
    }
}

export const serverError = () => {
    return {
        statusCode: 500,
        body: {
            message: 'internal server error',
        },
    }
}

export const unauthorized = () => {
    return {
        statusCode: 401,
        body: {
            message: 'unauthorized',
        },
    }
}

export const forbidden = () => {
    return {
        statusCode: 403,
        body: {
            message: 'forbidden',
        },
    }
}

export const created = (body) => {
    return {
        statusCode: 201,
        body,
    }
}

export const sucess = (body) => {
    return {
        statusCode: 200,
        body,
    }
}

export const notFound = (body) => {
    return {
        statusCode: 404,
        body,
    }
}
