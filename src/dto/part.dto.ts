import type { BaseDto } from "./common/base.dto";

export interface PartDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  partMasterId?: string;
  departmentId?: string;
  companyId?: string;
  branchId?: string;
  employees?: any[];
  positions?: any[];
  partMaster?: any;
  department?: any;
  company?: any;
  branch?: any;
}

export interface CreatePartDto {
  code: string;
  name: string;
  description?: string;
  partMasterId?: string;
  departmentId?: string;
  companyId?: string;
  branchId?: string;
}

export interface UpdatePartDto extends CreatePartDto {
  id: string;
}

export interface PartFilterDto {
  code?: string;
  name?: string;
  companyId?: string;
  branchId?: string;
  departmentId?: string;
  partMasterId?: string;
  isDeleted?: boolean;
}

export interface PartSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
