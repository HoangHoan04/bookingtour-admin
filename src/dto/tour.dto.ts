import type { BaseDto } from "./common/base.dto";

export interface TourDto extends BaseDto {
  code?: string;
  title: string;
  slug: string;
  location: string;
  durations: string;
  shortDescription: string;
  longDescription?: string;
  highlights?: string;
  included?: string;
  excluded?: string;
  rating: number;
  reviewCount: number;
  viewCount: number;
  bookingCount: number;
  category?: string;
  tags?: string[];
  status: string;
  tourDestinations: any[];
  tourDetails: any[];
  reviews: any[];
}

export interface CreateTourDto {
  code?: string;
  title: string;
  slug: string;
  location: string;
  durations: string;
  shortDescription: string;
  longDescription?: string;
  highlights?: string;
  included?: string;
  excluded?: string;
  rating: number;
  reviewCount: number;
  viewCount: number;
  bookingCount: number;
  category?: string;
  tags?: string[];
}

export interface UpdateTourDto extends CreateTourDto {
  id: string;
}

export interface TourFilterDto {
  code?: string;
  title?: string;
}

export interface TourSelectBoxDto {
  id: string;
  title: string;
  code: string;
}
