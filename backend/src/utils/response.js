export const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res, message, statusCode = 500, fields = null) => {
  const response = {
    success: false,
    error: {
      code: getErrorCode(statusCode),
      message,
    },
  };

  if (fields) {
    response.error.fields = fields;
  }

  return res.status(statusCode).json(response);
};

const getErrorCode = (statusCode) => {
  const codes = {
    400: 'VALIDATION_ERROR',
    401: 'AUTHENTICATION_ERROR',
    403: 'AUTHORIZATION_ERROR',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    429: 'RATE_LIMIT_EXCEEDED',
    500: 'INTERNAL_SERVER_ERROR',
  };
  return codes[statusCode] || 'UNKNOWN_ERROR';
};
