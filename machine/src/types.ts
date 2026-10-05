export interface Medicine {
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    product_type?: string[];
    route?: string[];
    [key: string]: string[] | undefined;
  };
}