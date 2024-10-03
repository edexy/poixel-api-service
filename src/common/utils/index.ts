export const excludeNullable = ({ value }) =>
  value === null ? undefined : value;

export const booleanize = ({ value }) => (value ? value === 'true' : false);

export function isValidJSON(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export function paginate(total: number, pageLimit: number, pageNo: number) {
  const totalPages = Math.ceil(total / pageLimit);

  return {
    total,
    pageSize: pageLimit,
    prevPage: pageNo > 1 ? pageNo - 1 : null,
    currentPage: pageNo,
    nextPage: pageNo < totalPages ? pageNo + 1 : null,
  };
}
