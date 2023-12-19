export enum ModsTypes {
  MOD = 'MOD',
  RESOURCE = 'RESOURCE_PACK',
  SHADER = 'SHADER_PACK',
}

export enum ModsFilters {
  ALL = 'ALL',
  SELECTED = 'SELECTED',
  UNSELECTED = 'UNSELECTED',
}

export type ModsFiltersTypes =
  | ModsFilters.ALL
  | ModsFilters.SELECTED
  | ModsFilters.UNSELECTED
  | ModsTypes.MOD
  | ModsTypes.RESOURCE
  | ModsTypes.SHADER;

export interface IMod {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  type: ModsTypes;
}

export interface IUIMod extends IMod {
  selected: boolean;
}
