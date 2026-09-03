export enum GlobalRoles {
    MasterRole = "Master",
    Owner = "Owner",
    Admin = "Admin",
    Developer = "Developer"
}

export const ROUTE_PERMISSIONS: string = "requiredPermissions";

export const PASSWORD_REGEX = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
