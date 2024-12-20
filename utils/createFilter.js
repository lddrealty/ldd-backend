const _ = require("lodash");
const createFilter = (query, options = {}) => {
  const { page = 1, limit = 6 } = options;

  // Sorting
  const sort = query.sort === "asc" ? { createdAt: 1 } : { createdAt: -1 };

  // Pagination options
  const paginationOptions = {
    page: _.toInteger(query.page || page),
    limit: _.toInteger(query.limit || limit),
    sort,
    lean: true,
  };

  return { options: paginationOptions };
};

module.exports = createFilter;
