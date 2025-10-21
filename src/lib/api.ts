import { createResource } from "./CreateResource";
import { BookingRoot } from "./types/booking";
import { RoleRoot } from "./types/role";
import { ServiceRoot } from "./types/service";
import { serviceCategoryRoot } from "./types/serviceCategory";
import { serviceTypeRoot } from "./types/serviceType";
import { getUserRoot } from "./types/user";

export const api = {
  user: createResource<getUserRoot>('/api/user'),
  role: createResource<RoleRoot>('/api/role'),
  booking: createResource<BookingRoot>('/api/booking'),
  service: createResource<ServiceRoot>('/api/service'),
  serviceCategory: createResource<serviceCategoryRoot>('/api/servicecategory'),
  categoryType: createResource<serviceTypeRoot>('/api/categoryType'),
  file: createResource('/api/file/upload/upload'),

};