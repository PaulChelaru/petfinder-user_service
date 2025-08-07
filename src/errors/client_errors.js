/* istanbul ignore file */
import CustomError from "./custom_error.js";

import {
    INVALID_PAYLOAD,
    RESOURCE_NOT_FOUND,
    PROCESSING_ERROR,
    DUPLICATE_VALUE,
    NOT_AUTHORIZED,
} from "./codes.js";

/* Error returned when the payload received does
* not respect the expected format. It sets the HTTP status
* code of the response to `400`, the error message
* to `Invalid parameters` and the error code to `INVALID_PAYLOAD`.
* @class
*/
class InvalidPayloadError extends CustomError {
    /**
    * @constructor
    * @param {*} [data={}] additional error data
    */
    constructor (data = {}) {
        const message = "Invalid parameters";
        super(message, INVALID_PAYLOAD, data, 400);
    }
}

/**
 * Error returned to client when it does not have the
 * permissions to access a specific resource. It sets
 * the HTTP status code of the response to `403` and the
 * error message is `Insufficient permissions to access the resource`.
 * @class
 */
class ForbiddenError extends CustomError {
    /**
     * @constructor
     * @param {Number} error_code code of the error
     * @param {*} [data={}] additional error information
     */
    constructor (error_code, data = {}) {
        const message = "Insufficient permissions to access the resource";
        super(message, error_code, data, 403);
    }
}

/**
 * Error returned when the requested resource is not found.
 * It sets the HTTP status code of the response to `404`
 * and the error code to `RESOURCE_NOT_FOUND`, if not
 * error code is provided.
 * @class
 */
class ResourceNotFoundError extends CustomError {
    /**
     * @constructor
     * @param {String} message message of the error
     * @param {Number} [error_code=RESOURCE_NOT_FOUND] code of the error
     */
    constructor (message, error_code = RESOURCE_NOT_FOUND) {
        super(message, error_code, {}, 404);
    }
}

/**
 * Error returned to client when the input values cannot
 * be processed due to restrictions or invalid entity
 * state. It sets the HTTP status code of the response to
 * `409` and the error code to `PROCESSING_ERROR`, if no
 * value is provided.
 * @class
 */
class InvalidOperationError extends CustomError {
    /**
     * @constructor
     * @param {String} message message of the error
     * @param {Number} [error_code=PROCESSING_ERROR] code of the error
     * @param {*} [data={}] additional error information
     */
    constructor (message, error_code = PROCESSING_ERROR, data = {}) {
        super(message, error_code, data, 409);
    }
}

/**
 * Error returned to client when the resource create
 * request violates uniqueness constraints. It sets the
 * HTTP code of the response to `422` and the error code
 * to `DUPLICATE_VALUE`.
 * @class
 */
class DuplicateValueError extends CustomError {
    /**
     * @constructor
     * @param {String} message message of the error
     * @param {*} [data={}] additional error information
     */
    constructor (message, data = {}) {
        super(message, DUPLICATE_VALUE, data, 422);
    }
}

/**
 * This error is returned when authorization are not in the expected
 * format. It sets the HTTP status code of the response to `401` and
 * the error message to `Invalid credentials for this resource`.
 * @class
 */
class InvalidTokenError extends CustomError {
    /**
     * @constructor
     * @param {Number} error_code code of the error
     * @param {*} [data={}] additional error data
     */
    constructor (error_code, data = {}) {
        const message = "Invalid credentials for this resource";
        super(message, error_code, data, 401);
    }
}

/** * This error is returned when the user is not authorized to access
 * a specific resource. It sets the HTTP status code of the response
 * to `403` and the error message to `Not authorized`.
 * @class
 */
class NotAuthorizedError extends CustomError {
    /**
     * @constructor
     * @param {Number} error_code code of the error
     * @param {*} [data={}] additional error data
     */
    constructor (data = {}) {
        const message = "Not authorized";
        super(message, NOT_AUTHORIZED, data, 403);
    }
}

export {
    InvalidPayloadError,
    ForbiddenError,
    ResourceNotFoundError,
    InvalidOperationError,
    DuplicateValueError,
    InvalidTokenError,
    NotAuthorizedError,
};
