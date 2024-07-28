import type { FilterOptionsEnum } from '../enums/FilterOptionsEnum';

type FilterOptions =
  | FilterOptionsEnum.YoungerThan12Months
  | FilterOptionsEnum.YoungerThan6Months
  | FilterOptionsEnum.BlackColor;

export type { FilterOptions as default };
