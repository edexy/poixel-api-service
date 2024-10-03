export type Pagination = {
  total: number;
  last_page: number;
  current_page: number;
  per_page: number;
  previous_page: number | null;
  next_page: number | null;
};
