import type { BaseDto } from "./common/base.dto";

// Tour Price DTO
export interface TourPriceDto extends BaseDto {
  code: string;
  price: number;
  priceType: string;
  currency: string;
  tourDetailId: string;
}

// Tour Detail DTO
export interface TourDetailDto extends BaseDto {
  tourId?: string;
  code: string;
  startDay: Date;
  endDay: Date;
  startLocation: string;
  capacity: number;
  remainingSeats: number;
  status: string;
  tourGuideId?: string;
}

export interface CreateTourDetailDto {
  startDay: Date;
  endDay: Date;
  startLocation: string;
  capacity: number;
  status?: string;
  tourGuideId?: string;
}

export interface UpdateTourDetailDto extends CreateTourDetailDto {
  id: string;
}

// Tour DTO
export interface TourDto extends BaseDto {
  code: string;
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
  tourDestinations?: any[];
  tourDetails?: TourDetailDto[];
  reviews?: any[];
}

export interface CreateTourDto {
  title: string;
  slug?: string; // Slug sẽ được tự động tạo từ title nếu không cung cấp
  location: string;
  durations: string;
  shortDescription: string;
  longDescription?: string;
  highlights?: string;
  included?: string;
  excluded?: string;
  category?: string;
  tags?: string[];
  status?: string;
  tourDetails?: CreateTourDetailDto[];
}

export interface UpdateTourDto extends CreateTourDto {
  id: string;
}

export interface TourFilterDto {
  title?: string;
  code?: string;
  location?: string;
  category?: string;
  tags?: string[];
  status?: string;
  isDeleted?: boolean;
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
