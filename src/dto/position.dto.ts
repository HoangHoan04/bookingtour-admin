import type { BaseDto, FileDto } from "./common/base.dto";

export interface PositionDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  status: string;
  displayOrder: number;
  images?: FileDto[];
}

export interface CreatePositionDto {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  status: string;
  displayOrder: number;
  images?: FileDto[];
}

export interface UpdatePositionDto extends CreatePositionDto {
  id: string;
}

export interface PositionFilterDto {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface PositionSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
