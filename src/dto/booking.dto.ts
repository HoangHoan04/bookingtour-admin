import type { BaseDto } from "./common/base.dto";

export interface BookingDto extends BaseDto {
  tourId: string;
  contactFullname: string;
  contactEmail: string;
  contactPhone: string;
  bookingDate: Date;
  status: string;
  tour?: {
    id: string;
    title: string;
  };
}
