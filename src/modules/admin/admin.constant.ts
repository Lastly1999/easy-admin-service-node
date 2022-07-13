/**
 * jwt常量配置
 * @author lastly1999
 * @date 2022年7月6日00:41:57
 */
export enum JwtConstant {
    // 加密秘钥
    JWT_SALT = 'abcdefgihjdsajaskdk@!!sad#$',
}


/**
 * 授权redis 命名空间 枚举
 */
export enum AuthRedisConstant {
    CAPTCHA_PREFIX = 'admin:auth:captchaid',
}
