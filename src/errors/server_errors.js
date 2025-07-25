/* istanbul ignore file */

import CustomError from "./custom_error.js";
import {
    INVALID_PATH,
    SERVER_ERROR,
    EXTERNAL_RESOURCE_ERROR,
} from "./codes.js";

/**
 * Generic error returned when server cannot process
 * the request due to unexpected errors. It sets the
 * HTTP status code of the response to `500`.
 * @class
 */
class ApplicationError extends CustomError {
    /**
     * @constructor
     * @param {String} message message of the error
     * @param {Number} error_code code of the error
     * @param {*} [data={}] additional error data
     */
    constructor (message, error_code, data = {}) {
        super(message, error_code, data, 500);
    }
}

/**
 * Error returned when the requested path is not implemented
 * it sets the HTTP status code of the response to `501`, the
 * error message to `Not Implemented` and error code to
 * `INVALID_PATH`.
 * @class
 */
class PathNotImplementedError extends CustomError {
    /**
     * @constructor
     * @param {*} [data={}] additional error information
     */
    constructor (data = {}) {
        const message = "Not Implemented";
        super(message, INVALID_PATH, data, 501);
    }
}

/**
 * Error returned when an external resource (mongo, redis,
 * kafka etc) returns an error. It sets the HTTP status
 * code to `500`, the error message to `Server error` and
 * the error code to `SERVER_ERROR`.
 */
class ServerError extends CustomError {
    /**
     * @constructor
     * @param {*} [data={}] additional error information
     */
    constructor (data = {}) {
        const message = "Server error occurred";
        super(message, SERVER_ERROR, data, 500);
    }
}

/**
 * Error returned when an external API is returns an
 * unexpected error. It sets the HTTP status code to
 * `500`, the error message to `Error occurred while`
 * `processing the request`, if no value is provided,
 * and the error code to `EXTERNAL_RESOURCE_ERROR`.
 * @class
 */
class ExternalApiError extends CustomError {
    /**
     * @constructor
     * @param {String} [message="Error occurred while processing the request"] message of the error
     * @param {*} [data={}] additional error information
     */
    constructor (message = "Error occurred while processing the request", data = {}) {
        super(message, EXTERNAL_RESOURCE_ERROR, data, 500);
    }
}

export {
    ApplicationError,
    PathNotImplementedError,
    ServerError,
    ExternalApiError,
};
