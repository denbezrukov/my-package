import countries from './countries.json';
import { csvParse } from 'd3-dsv';
import { data } from './data';

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
  coordinates: Coordinate[];
}

export type Coordinate = [number, number];

export interface CountryInfo {
  '2017 [YR2017]': number;
  'Country Code': string;
  'Country Name': string;
  'Series Code': string;
  'Series Name': string;
}

export const countryList: Country[] = (countries as any).features;
export const countryInfo = csvParse(data) as unknown as CountryInfo[];
