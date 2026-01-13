import type { BaseDto, FileDto } from "./common/base.dto";

export interface CompanyDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  address?: string;
  taxCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  status: string;
  foundedDate?: Date;
  legalRepresentative?: string;
  parentCompanyId?: string;
  employees: any[];
  positions: any[];
  departments: any[];
  branches: any[];
  parts: any[];
  shiftMasters: any[];
  logoUrl?: FileDto;
  documents?: FileDto[];
  childCompanies?: CompanyDto[];
}

export interface CreateCompanyDto {
  code: string;
  name: string;
  description?: string;
  address?: string;
  taxCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  status: string;
  foundedDate?: Date;
  legalRepresentative?: string;
  parentCompanyId?: string;
  logoUrl?: string;
  documentIds?: string[];
}

export interface UpdateCompanyDto extends CreateCompanyDto {
  id: string;
}

export interface CompanyFilterDto {
  code?: string;
  name?: string;
  taxCode?: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
  isDeleted?: boolean;
}

export interface CompanySelectBoxDto {
  id: string;
  code: string;
  name: string;
}
