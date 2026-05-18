const jwt = require('jsonwebtoken');
const axios = require('axios');

// ID de um usuário ativo do banco de dados
const userId = '07e970dc-f682-4fd2-ae63-c90af49529be';
const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';

// Criar um token JWT como faria o backend
const token = jwt.sign(
    { email: 'daniel.almeida@assec.com.br', sub: userId, role: 'USER' },
    jwtSecret,
    { expiresIn: '7d' }
);

console.log('✅ JWT Token gerado:', token);

// Testar o endpoint /users/me
axios
    .get('http://localhost:3001/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then((response) => {
        console.log('\n✅ Resposta do /users/me:');
        console.log(JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
        console.error('\n❌ Erro ao chamar /users/me:');
        console.error('Status:', error.response?.status);
        console.error('Mensagem:', error.response?.data);
    });
