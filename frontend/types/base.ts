export interface IPagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface IMeta {
    pagination: IPagination
}