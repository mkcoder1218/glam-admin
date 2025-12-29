import { createResource } from "./CreateResource";
import { analyticsRoot } from "./types/analytics";
import { BookingRoot } from "./types/booking";
import { Booking_View } from "./types/bookingView";
import { galleryRoot } from "./types/gallery";
import { PointRoot } from "./types/point";
import { PromoRoot } from "./types/promoCode";
import { RoleRoot } from "./types/role";
import { RoleAccessRoot } from "./types/roleAccess";
import { ServiceRoot } from "./types/service";
import { serviceCategoryRoot } from "./types/serviceCategory";
import { serviceTypeRoot } from "./types/serviceType";
import { getUserRoot, ProfileRoot } from "./types/user";

export const api = {
  auth: createResource<getUserRoot>("/api/auth/login"),
  user: createResource<getUserRoot>("/api/user"),
  regester: createResource<getUserRoot>("/api/auth/register"),
  analytics: createResource<analyticsRoot>("/api/analytics"),
  role: createResource<RoleRoot>("/api/role"),
  point: createResource<PointRoot>("/api/points"),
  roleAccess: createResource<RoleAccessRoot>("/api/accessrule"),
  roleAccessrule: createResource<RoleAccessRoot>("/api/roleaccessrule"),
  gallery: createResource<galleryRoot>("/api/gallery"),
  booking: createResource<BookingRoot>("/api/booking"),
  bookingview: createResource<Booking_View>("/api/bookings/view"),
  checkin: createResource<BookingRoot>("/api/booking"),
  uncheck: createResource<BookingRoot>("/api/booking"),
  service: createResource<ServiceRoot>("/api/service"),
  promocode: createResource<PromoRoot>("/api/promocode"),
  serviceCategory: createResource<serviceCategoryRoot>("/api/servicecategory"),
  categoryType: createResource<serviceTypeRoot>("/api/categoryType"),
  file: createResource("/api/file/upload/upload"),
  profile: createResource<ProfileRoot>("/api/auth/profile"),
};
