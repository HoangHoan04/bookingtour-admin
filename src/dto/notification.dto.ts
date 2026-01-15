import type { PaginationDto } from "./common/base.dto";

// Enums
export type NotificationType =
  | "system"
  | "booking"
  | "payment"
  | "promotion"
  | "general";
export type NotificationPriority = "low" | "normal" | "high" | "urgent";
export type RelatedEntityType = "booking" | "payment" | "tour" | "user";

// Interface cho notification item
export interface NotificationItem {
  id: string;
  customerId: string;
  title: string;
  content: string;
  notificationType: NotificationType;
  relatedEntity?: RelatedEntityType | null;
  relatedId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  priority: NotificationPriority;
  actionUrl?: string | null;
  expiresAt?: string | null;
  icon?: string | null;
  color?: string | null;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  customer?: {
    id: string;
    fullName?: string;
    email?: string;
    avatar?: string;
  };
}

// DTO để tạo notification
export interface NotificationCreateDto {
  lstUserId?: string[];
  title: string;
  content: string;
  notificationType?: NotificationType;
  relatedEntity?: RelatedEntityType;
  relatedId?: string;
  priority?: NotificationPriority;
  actionUrl?: string;
  expiresAt?: string;
  icon?: string;
  color?: string;
}

// DTO để cập nhật notification
export interface NotificationUpdateDto {
  title?: string;
  content?: string;
  notificationType?: NotificationType;
  priority?: NotificationPriority;
  actionUrl?: string;
  icon?: string;
  color?: string;
}

// DTO để filter notification
export interface NotificationFilterDto {
  notificationType?: NotificationType;
  priority?: NotificationPriority;
  isRead?: boolean;
  relatedEntity?: RelatedEntityType;
}

// DTO pagination cho notification
export type NotificationPaginationDto = PaginationDto<NotificationFilterDto>;

// DTO để đánh dấu đã đọc
export interface MarkReadListDto {
  lstId: string[];
}

// Response count
export interface NotificationCountResponse {
  countAll: number;
}

// DTO cài đặt notification
export interface NotificationSettingDto {
  id: string;
  customerId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  promotionNotifications: boolean;
  bookingNotifications: boolean;
  recommendationNotifications: boolean;
  createdAt: string;
  updatedAt?: string;
}

// DTO cập nhật cài đặt
export interface UpdateNotificationSettingDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  promotionNotifications?: boolean;
  bookingNotifications?: boolean;
  recommendationNotifications?: boolean;
}
