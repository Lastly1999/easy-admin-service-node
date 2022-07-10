export default () => ({
    port: 3000,
    database: {
        type: 'mysql',
        host: '81.69.196.144',
        port: 3306,
        username: 'root',
        password: 'Chen1027',
        database: 'easy_cms',
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
    },
    svgcaptcha: {
        inverse: false, // 翻转颜色
        fontSize: 0, // 验证码文字大小
        noise: 2, // 噪声线条数
        width: 100, // 宽度
        height: 40, // 高度
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    },
    redis: {
        port: 6379,
        host: '106.12.161.121',
        password: 'pwd123',
        db: 1,
    },
});
