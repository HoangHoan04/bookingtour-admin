import type { BaseDto, FileDto } from "./common/base.dto";

export interface EmployeeDto extends BaseDto {
  code: string;
  lastName: string;
  firstName: string;
  fullName: string;
  phone: string;
  email: string;
  description: string;
  gender: string;
  birthday: Date;
  roleIds: string[];
}

export interface CreateEmployeeDto {
  code: string;
  lastName: string;
  firstName: string;
  fullName?: string;
  phone: string;
  email: string;
  gender: string;
  birthday?: Date;
  positionId?: string;
  description?: string;
  avatar?: FileDto[];
  roleIds: string[];
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  id: string;
}

export interface ChangePasswordDto {
  employeeId: string;
  newPassword: string;
}

export interface EmployeeFilter {
  code?: string;
  name?: string;
  phone?: string;
  email?: string;
  isDeleted?: boolean;
}

export interface EmployeeSelectBoxDto {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  positionName?: string;
}
