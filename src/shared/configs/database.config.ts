import * as dotenv from 'dotenv';
dotenv.config();

export default {
  client: 'mysql',
  connection: {
    host: process.env.HOST_NAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
  },
};
