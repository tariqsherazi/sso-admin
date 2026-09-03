import { GlobalRoles } from '../../common';
import { RoleEntity } from '../entities/role.entity';
import * as permissions from './permissions.data';

export const ROLES_DATA: RoleEntity[] = [
  {
    name: GlobalRoles.MasterRole.toString(),
    description: "User who has this access level can manage whole application",
    createdBy: -1 as any,
    permissions: Promise.resolve([
      permissions.CAN_ACCESS_DASHBOARD,
      permissions.CAN_ACCESS_ORGANIZATIONS,
      permissions.CAN_ACCESS_ROLES,
      permissions.CAN_ACCESS_APPLICATIONS,
      permissions.CAN_ACCESS_USERS,
      permissions.CAN_ACCESS_MEMBERS,

      permissions.CAN_CREATE_ORGANIZATION,
      permissions.CAN_UPDATE_ORGANIZATION,
      permissions.CAN_VIEW_ORGANIZATION,
      permissions.CAN_DELETE_ORGANIZATION,

      permissions.CAN_CREATE_APPLICATION,
      permissions.CAN_UPDATE_APPLICATION,
      permissions.CAN_VIEW_APPLICATION,
      permissions.CAN_DELETE_APPLICATION,
      permissions.CAN_REGENERATE_APPLICATION_HASH,

      permissions.CAN_CREATE_USER,
      permissions.CAN_UPDATE_USER,
      permissions.CAN_VIEW_USER,
      permissions.CAN_DELETE_USER,

      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_UPDATE_MEMBER,
      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_DELETE_MEMBER,
      permissions.CAN_VIEW_MEMBER,
      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_INVITE_MEMBER,

      permissions.CAN_CREATE_ROLE,
      permissions.CAN_UPDATE_ROLE,
      permissions.CAN_VIEW_ROLE,
      permissions.CAN_DELETE_ROLE,
      permissions.CAN_DELETE_ADMIN,
      permissions.CAN_DELETE_OWNER,
    ]),
  },
  {
    name: GlobalRoles.Owner.toString(),
    description: "User who has this access level can manage whole organization that he owns",
    createdBy: -1 as any,
    permissions: Promise.resolve([
      permissions.CAN_ACCESS_DASHBOARD,
      permissions.CAN_ACCESS_ROLES,
      permissions.CAN_ACCESS_APPLICATIONS,
      permissions.CAN_ACCESS_USERS,
      permissions.CAN_ACCESS_MEMBERS,

      permissions.CAN_UPDATE_ORGANIZATION,

      permissions.CAN_CREATE_APPLICATION,
      permissions.CAN_UPDATE_APPLICATION,
      permissions.CAN_VIEW_APPLICATION,
      permissions.CAN_DELETE_APPLICATION,
      permissions.CAN_REGENERATE_APPLICATION_HASH,

      permissions.CAN_CREATE_USER,
      permissions.CAN_UPDATE_USER,
      permissions.CAN_VIEW_USER,
      permissions.CAN_DELETE_USER,

      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_UPDATE_MEMBER,
      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_DELETE_MEMBER,
      permissions.CAN_VIEW_MEMBER,
      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_INVITE_MEMBER,

      permissions.CAN_CREATE_ROLE,
      permissions.CAN_UPDATE_ROLE,
      permissions.CAN_VIEW_ROLE,
      permissions.CAN_DELETE_ROLE,
      permissions.CAN_DELETE_ADMIN,
    ]),
  },
  {
    name: GlobalRoles.Admin.toString(),
    description: "User who has this access level can manage few modules",
    createdBy: -1 as any,
    permissions: Promise.resolve([
      permissions.CAN_ACCESS_DASHBOARD,
      permissions.CAN_ACCESS_ROLES,
      permissions.CAN_ACCESS_APPLICATIONS,
      permissions.CAN_ACCESS_USERS,
      permissions.CAN_ACCESS_MEMBERS,

      permissions.CAN_UPDATE_ORGANIZATION,

      permissions.CAN_CREATE_APPLICATION,
      permissions.CAN_UPDATE_APPLICATION,
      permissions.CAN_VIEW_APPLICATION,
      permissions.CAN_DELETE_APPLICATION,
      permissions.CAN_REGENERATE_APPLICATION_HASH,

      permissions.CAN_CREATE_USER,
      permissions.CAN_UPDATE_USER,
      permissions.CAN_VIEW_USER,
      permissions.CAN_DELETE_USER,

      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_UPDATE_MEMBER,
      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_DELETE_MEMBER,
      permissions.CAN_VIEW_MEMBER,
      permissions.CAN_INVITE_MEMBER,
      permissions.CAN_INVITE_MEMBER,

      permissions.CAN_CREATE_ROLE,
      permissions.CAN_UPDATE_ROLE,
      permissions.CAN_VIEW_ROLE,
      permissions.CAN_DELETE_ROLE
    ])
  },
  {
    name: GlobalRoles.Developer.toString(),
    description: "User who has this access level can manage users for IDP",
    createdBy: -1 as any,
    permissions: Promise.resolve([
      permissions.CAN_ACCESS_DASHBOARD,
      permissions.CAN_ACCESS_ROLES,
      permissions.CAN_ACCESS_APPLICATIONS,
      permissions.CAN_ACCESS_USERS,

      permissions.CAN_CREATE_APPLICATION,
      permissions.CAN_VIEW_APPLICATION,


      permissions.CAN_CREATE_USER,
      permissions.CAN_UPDATE_USER,
      permissions.CAN_VIEW_USER,
      permissions.CAN_DELETE_USER,


      permissions.CAN_VIEW_MEMBER,

      permissions.CAN_CREATE_ROLE,
      permissions.CAN_UPDATE_ROLE,
      permissions.CAN_VIEW_ROLE,
      permissions.CAN_DELETE_ROLE
    ])
  }
];
