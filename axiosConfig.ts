const axios = require('axios');

// Crie uma instância do Axios
const axiosConfig = axios.create({
  baseURL: 'https://salvus-backend-a064a9dafad6.herokuapp.com', // Altere para o seu URL base
  timeout: 10000, // 10 segundos de timeout
});

export default axiosConfig;