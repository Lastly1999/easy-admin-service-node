export class FindUserListInterface {
    userId: number;
    departmentName: string;
    departmentId: number;
    name: string;
    email: string;
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
