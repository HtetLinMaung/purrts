export const throwHttpException = (messageOrData: any, status = 500) => {
  const err: any = new Error();
  err.status = status;
  if (typeof messageOrData == "string") {
    err.message = messageOrData;
  } else {
    err.message = messageOrData.message;
    err.data = messageOrData;
  }
  throw err;
};

export const throwBadRequestException = (messageOrData: any) => {
  throwHttpException(messageOrData, 400);
};

export const throwUnauthorizedException = (messageOrData: any) => {
  throwHttpException(messageOrData, 401);
};

export const throwNotFoundException = (messageOrData: any) => {
  throwHttpException(messageOrData, 404);
};

export const throwForbiddenException = (messageOrData: any) => {
  throwHttpException(messageOrData, 403);
};

export const throwInternalServerErrorException = (messageOrData: any) => {
  throwHttpException(messageOrData);
};
