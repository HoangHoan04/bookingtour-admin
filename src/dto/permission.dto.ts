import type { BaseDto } from "./common/base.dto";

export interface PermissionDto extends BaseDto {
  name: string;
  code: string;
  module: string;
  description?: string;
}

export interface CreatePermissionDto {
  name: string;
  code: string;
  module: string;
  description?: string;
}

export interface UpdatePermissionDto extends CreatePermissionDto {
  id: string;
}

export interface PermissionFilterDto {
  code?: string;
  name?: string;
  isDeleted?: boolean;
}

export interface PermissionSelectBoxDto {
  id: string;
  code: string;
  name: string;
}

export interface PermissionNode {
  key: string;
  label: string;
  children?: PermissionNode[];
  data?: any;
  isLeaf?: boolean;
}
