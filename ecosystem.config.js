module.exports = {
    apps: [
        {
            name: 'easy-admin-service-node',
            script: './dist/main.js',
            autorestart: true,
            merge_logs: false, // 设置追加日志而不是新建日志
            error_file: './logs/app-err.log', // 自定义应用程序的错误日志文件(错误日志文件)
            out_file: './logs/app-out.log', // 自定义应用程序日志文件(正常日志文件)
            log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
        },
    ],
};
