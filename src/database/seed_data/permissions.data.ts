import { PermissionEntity } from '../entities/permission.entity';

// Modules Permissions
export const CAN_ACCESS_DASHBOARD: PermissionEntity = {
  slug: "can.access.dashboard",
  description: "User who has this access will able to see dashboard module at frontend.",
  name: "Can Access Dashboard",
  createdBy: -1 as any
};
export const CAN_ACCESS_ORGANIZATIONS: PermissionEntity = {
  slug: "can.access.organizations",
  description: "User who has this access will able to see organizations module at frontend.",
  name: "Can Access Organizations",
  createdBy: -1 as any
};
export const CAN_ACCESS_ROLES: PermissionEntity = {
  slug: "can.access.roles",
  description: "User who has this access will able to see roles module at frontend.",
  name: "Can Access Roles",
  createdBy: -1 as any
};
export const CAN_ACCESS_APPLICATIONS: PermissionEntity = {
  slug: "can.access.applications",
  description: "User who has this access will able to see applications module at frontend.",
  name: "Can Access Applications",
  createdBy: -1 as any
};
export const CAN_ACCESS_MEMBERS: PermissionEntity = {
  slug: "can.access.members",
  description: "User who has this access will able to see members module at frontend.",
  name: "Can Access Members",
  createdBy: -1 as any
};
export const CAN_ACCESS_USERS: PermissionEntity = {
  slug: "can.access.users",
  description: "User who has this access will able to see users module at frontend.",
  name: "Can Access Users",
  createdBy: -1 as any
};

// organization
export const CAN_CREATE_ORGANIZATION: PermissionEntity = {
  slug: "can.create.organization",
  description: "User who has this access can create new organization in system",
  name: "Can Create Organization",
  createdBy: -1 as any
};
export const CAN_UPDATE_ORGANIZATION: PermissionEntity = {
  slug: "can.update.organization",
  description: "User who has this access can update organization in system",
  name: "Can Update Organization",
  createdBy: -1 as any
};
export const CAN_VIEW_ORGANIZATION: PermissionEntity = {
  slug: "can.view.organization",
  description: "User who has this access can list or get organization from system",
  name: "Can View Organization",
  createdBy: -1 as any
};
export const CAN_DELETE_ORGANIZATION: PermissionEntity = {
  slug: "can.delete.organization",
  description: "User who has this access can delete organization in system",
  name: "Can Delete Organization",
  createdBy: -1 as any
};

// application
export const CAN_CREATE_APPLICATION: PermissionEntity = {
  slug: "can.create.application",
  description: "User who has this access can create new organization in system",
  name: "Can Create application",
  createdBy: -1 as any
};
export const CAN_UPDATE_APPLICATION: PermissionEntity = {
  slug: "can.update.application",
  description: "User who has this access can update application in system",
  name: "Can Update application",
  createdBy: -1 as any
};
export const CAN_VIEW_APPLICATION: PermissionEntity = {
  slug: "can.view.application",
  description: "User who has this access can list or get application from system",
  name: "Can View application",
  createdBy: -1 as any
};

export const CAN_DELETE_APPLICATION: PermissionEntity = {
  slug: "can.delete.application",
  description: "User who has this access can delete application in system",
  name: "Can Delete application",
  createdBy: -1 as any
};

export const CAN_REGENERATE_APPLICATION_HASH: PermissionEntity = {
  slug: "can.regenerate.application.hash",
  description: "User who has this access can regenerate application  hash in system",
  name: "Can regenerate application hash",
  createdBy: -1 as any
};
// user
export const CAN_CREATE_USER: PermissionEntity = {
  slug: "can.create.user",
  description: "User who has this access can create new user in system",
  name: "Can Create user",
  createdBy: -1 as any
};
export const CAN_UPDATE_USER: PermissionEntity = {
  slug: "can.update.user",
  description: "User who has this access can update user in system",
  name: "Can Update user",
  createdBy: -1 as any
};
export const CAN_VIEW_USER: PermissionEntity = {
  slug: "can.view.user",
  description: "User who has this access can list or get user from system",
  name: "Can View user",
  createdBy: -1 as any
};
export const CAN_DELETE_USER: PermissionEntity = {
  slug: "can.delete.user",
  description: "User who has this access can delete user in system",
  name: "Can Delete User",
  createdBy: -1 as any
};
export const CAN_UPDATE_USER_PASSWORD: PermissionEntity = {
  slug: "can.update.user.password",
  description: "User who has this access can update user password in system",
  name: "Can Update User Password",
  createdBy: -1 as any
};


// members
export const CAN_INVITE_MEMBER: PermissionEntity = {
  slug: "can.invite.member",
  description: "User who invite member in system",
  name: "Can Invite Member",
  createdBy: -1 as any
};

export const CAN_UPDATE_MEMBER: PermissionEntity = {
  slug: "can.update.member",
  description: "User who update member in system",
  name: "Can Update Member",
  createdBy: -1 as any
};

export const CAN_DELETE_MEMBER: PermissionEntity = {
  slug: "can.delete.member",
  description: "User who delete member in system",
  name: "Can delete Member",
  createdBy: -1 as any
};

export const CAN_VIEW_MEMBER: PermissionEntity = {
  slug: "can.update.member",
  description: "User who has this access can member  in system",
  name: "Can Update member",
  createdBy: -1 as any
};

// role
export const CAN_CREATE_ROLE: PermissionEntity = {
  slug: "can.create.role",
  description: "User who has this access can create new role in system",
  name: "Can Create user",
  createdBy: -1 as any
};
export const CAN_UPDATE_ROLE: PermissionEntity = {
  slug: "can.update.role",
  description: "User who has this access can role user in system",
  name: "Can Update Role",
  createdBy: -1 as any
};
export const CAN_VIEW_ROLE: PermissionEntity = {
  slug: "can.view.role",
  description: "User who has this access can list or get role from system",
  name: "Can View role",
  createdBy: -1 as any
};
export const CAN_DELETE_ROLE: PermissionEntity = {
  slug: "can.delete.role",
  description: "User who has this access can delete role in system",
  name: "Can Delete role",
  createdBy: -1 as any
};

export const CAN_DELETE_ADMIN: PermissionEntity = {
  slug: "can.delete.admin",
  description: "User who has this access can delete admin in system",
  name: "Can Delete Admin",
  createdBy: -1 as any
};
export const CAN_DELETE_OWNER: PermissionEntity = {
  slug: "can.delete.owner",
  description: "User who has this access can delete pwner in system",
  name: "Can Delete Owner",
  createdBy: -1 as any
};



