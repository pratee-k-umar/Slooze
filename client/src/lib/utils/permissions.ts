import { Role } from '@/types/user';

export const hasRole = (userRole: Role, allowedRoles: Role[]): boolean => {
  return allowedRoles.includes(userRole);
};

export const canCheckoutOrder = (role: Role): boolean => {
  return role === Role.ADMIN || role === Role.MANAGER;
};

export const canCancelOrder = (role: Role): boolean => {
  return role === Role.ADMIN || role === Role.MANAGER;
};

export const canUpdatePaymentMethod = (role: Role): boolean => {
  return role === Role.ADMIN;
};

export const canCreateRestaurant = (role: Role): boolean => {
  return role === Role.ADMIN || role === Role.MANAGER;
};

export const canCreateMenuItem = (role: Role): boolean => {
  return role === Role.ADMIN || role === Role.MANAGER;
};
