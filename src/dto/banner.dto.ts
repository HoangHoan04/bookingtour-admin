import type { BaseDto, FileDto } from "./common/base.dto";

export interface BannerDto extends BaseDto {
  title: string;
  displayOrder: number;
  isVisible: boolean;
  effectiveStartDate?: Date;
  effectiveEndDate?: Date;
  type?: string;
  image: FileDto[];
  status: string;
}

export interface CreateBannerDto {
  title: string;
  displayOrder: number;
  isVisible: boolean;
  effectiveStartDate?: Date;
  effectiveEndDate?: Date;
  type?: string;
  image: FileDto[];
}

export interface UpdateBannerDto extends CreateBannerDto {
  id: string;
}

export interface BannerFilterDto {
  title?: string;
  status?: string;
  type?: string;
}

export interface BannerSelectBoxDto {
  id: string;
  title: string;
}
