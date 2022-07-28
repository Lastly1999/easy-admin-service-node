export class FindUserListInterface {
    userId: number;
    departmentId: number;
    name: string;
    userName: string;
    nickName: string;
    headImg: string;
    phone: string;
    remark: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    roles: { roleId: number; roleName: string }[];
}
