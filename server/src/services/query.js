const DEFALUT_PAGE_NUM = 1;
const DEFALUT_PAGE_LIMIT = 0;
function getPagination(query) {
  const page = Math.abs(query.page) || DEFALUT_PAGE_NUM;
  const limit = Math.abs(query.limit) || DEFALUT_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  return {
    skip,
    limit,
  };
}
module.exports = {
  getPagination,
};
