import type { BaseDto } from "./common/base.dto";

export interface BranchDto extends BaseDto {
  code: string;
  name: string;
  companyId?: string;
  description?: string;
  address?: string;
  ipAddress?: string;
  shortName?: string;
  phoneNumber?: string;
  email?: string;
  isHeadquarters?: boolean;
  partMasterIds?: string[];
  branchPartMasters?: any[];
  departments: any[];
  positions: any[];
  employees: any[];
  type?: string;
}

export interface CreateBranchDto {
  code: string;
  name: string;
  companyId?: string;
  description?: string;
  address?: string;
  ipAddress?: string;
  shortName?: string;
  phoneNumber?: string;
  email?: string;
  isHeadquarters?: boolean;
  partMasterIds?: string[];
  type?: string;
}

export interface UpdateBranchDto extends CreateBranchDto {
  id: string;
}

export interface BranchFilterDto {
  code?: string;
  name?: string;
  companyId?: string | null;
  shortName?: string;
  type?: string | null;
  isDeleted?: boolean;
  isHeadquarters?: boolean | null;
  
}

export interface BranchSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
