import type { BaseDto } from "./common/base.dto";

export interface DepartmentTypeDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
}

export interface CreateDepartmentTypeDto {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateDepartmentTypeDto extends CreateDepartmentTypeDto {
  id: string;
}

export interface DepartmentTypeFilterDto {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface DepartmentTypeSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
