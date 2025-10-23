export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/hospital_buffoni_db',
  },
  environment: process.env.NODE_ENV || 'development',
});