import type { BranchDto } from "./branch.dto";
import type { BaseDto } from "./common/base.dto";
import type { CompanyDto } from "./company.dto";
import type { DepartmentTypeDto } from "./department-type.dto";

export interface DepartmentDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  limit?: number;
  departmentTypeId?: string;
  companyId?: string;
  branchId?: string;
  departmentType?: DepartmentTypeDto;
  company?: CompanyDto;
  branch?: BranchDto;
  parentDepartment?: DepartmentDto;
  childDepartments?: DepartmentDto[];
  employees?: any[];
  parts?: any[];
  positions?: any[];
}

export interface CreateDepartmentDto {
  code: string;
  name: string;
  description?: string;
  limit?: number;
  departmentTypeId?: string;
  companyId?: string;
  branchId?: string;
  parentId?: string;
}

export interface UpdateDepartmentDto extends CreateDepartmentDto {
  id: string;
}

export interface DepartmentFilterDto {
  code?: string;
  name?: string;
  companyId?: string | null;
  branchId?: string | null;
  departmentTypeId?: string | null;
  isDeleted?: boolean;
}

export interface DepartmentSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
