import type { BaseDto } from "./common/base.dto";

export interface PartMasterDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  branchIds?: string[];
  branchPartMasters?: any[];
  parts?: any[];
}

export interface CreatePartMasterDto {
  code: string;
  name: string;
  description?: string;
  branchIds?: string[];
}

export interface UpdatePartMasterDto extends CreatePartMasterDto {
  id: string;
}

export interface PartMasterFilterDto {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface PartMasterSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
