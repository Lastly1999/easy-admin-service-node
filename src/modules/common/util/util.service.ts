import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
    public toTree(data: Array<any>) {
        // 删除 所有 children,以防止多次调用
        data.forEach(function (item) {
            delete item.children;
        });

        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
        const map = {};
        data.forEach(function (item) {
            map[item.id] = item;
        });

        const val = [];
        data.forEach(function (item) {
            // 以当前遍历项，的pid,去map对象中找到索引的id
            const parent = map[item.parentId];
            // 如果有parent，向parent元素中push该节点
            if (parent) {
                (parent.children || (parent.children = [])).push(item);
            } else {
                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                val.push(item);
            }
        });
        return val;
    }
}
