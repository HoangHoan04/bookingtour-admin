import type { BaseDto, FileDto } from "./common/base.dto";

export interface PositionMasterDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  status: string;
  displayOrder: number;
  images?: FileDto[];
}

export interface CreatePositionMasterDto {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  status: string;
  displayOrder: number;
  images?: FileDto[];
}

export interface UpdatePositionMasterDto extends CreatePositionMasterDto {
  id: string;
}

export interface PositionMasterFilterDto {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface PositionMasterSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
