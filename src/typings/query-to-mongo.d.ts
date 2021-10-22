declare module "query-to-mongo" {
  function q2m<T>(query: object): {
    criteria: T;
    options: {
      skip: number;
      limit: number;
      sort: keyof T;
      fields: keyof T;
    };
    links: (
      path: string,
      total: number
    ) => {
      prev?: string;
      first?: string;
      last?: string;
      next?: string;
    } | null;
  };
  export = q2m;
}
