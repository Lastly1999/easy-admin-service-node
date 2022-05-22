export default () => ({
  port: 3000,
  database: {
    type: 'mysql',
    host: '',
    port: 3306,
    username: '',
    password: '',
    database: 'easy_cms',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  },
});
