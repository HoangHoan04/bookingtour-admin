import type { PaginationDto } from "./common/base.dto";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  status: string;
  publishDate: string;
  isRead: boolean;
  readAt?: string | null;
  sender?: {
    id: string;
    fullName?: string;
    avatar?: string;
  };
}

export interface NotificationFilterDto {
  type?: string;
  priority?: string;
  status?: string;
}

export type NotificationPaginationDto = PaginationDto<NotificationFilterDto>;
