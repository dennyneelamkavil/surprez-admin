export interface Role {
  id: string;
  name: string;
  isSuperAdmin: boolean;
  permissions: string[];
}
