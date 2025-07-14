// LoggingMiddleware/log.js
// import axios from 'axios';

export const log = async (stack, level, pkg, message, token) => {
  try {
    const res = await axios.post(
      'http://20.244.56.144/evaluation-service/logs', 
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('Log sent:', res.data.message);
  } catch (err) {
    console.error('Log failed:', err.response?.data || err.message);
  }
};
