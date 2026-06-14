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
