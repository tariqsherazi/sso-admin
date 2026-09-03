import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { keysToCamel } from "../../common/helpers";

const data = {
  defaultSkip: 0,
  defaultPage: 0,
  defaultLimit: 10,
  defaultOrder: {},
  defaultOrderDirection: "ASC",
  maxAllowedSize: 100,
};

/**
 * Decorator intended for building a PaginationRequest object based on the query string parameters
 */
export const PaginationParams = createParamDecorator((requestData: any, ctx: ExecutionContext) => {
  let {
    query: {
      // eslint-disable-next-line prefer-const
      skip, page, limit, orderBy, orderDirection, ...params
    },
  } = ctx.switchToHttp().getRequest();

  const {
    defaultSkip, defaultPage, defaultLimit, defaultOrder, defaultOrderDirection, maxAllowedSize,
  } = data;

  const order = orderBy ? { [orderBy]: orderDirection || defaultOrderDirection } : defaultOrder;

  limit = limit && limit > 0 ? +limit : defaultLimit;

  if (!skip) {
    if (page) {
      skip = (+page - 1) * +limit;
      skip = skip >= 0 ? skip : 0;
    } else {
      page = defaultPage;
      skip = defaultSkip;
    }
  } else {
    page = Math.floor(+skip / limit);
  }

  limit = +limit < +maxAllowedSize ? limit : maxAllowedSize;
  return Object.assign(data || {}, {
    skip,
    page,
    limit,
    order,
    params: keysToCamel(params),
  });
});
