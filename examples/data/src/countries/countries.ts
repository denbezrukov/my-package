import countries from './countries.json';

export interface Countries {
  features: Country[];
}

export interface Country {
  geometry: Geometry;
  properties: Properties;
}

export interface Properties {
  ADM0_A3_IS: string;
  NAME: string;
}

export interface Geometry {
  coordinates: [number, number][];
}

export const countryList = (countries as Countries).features;
