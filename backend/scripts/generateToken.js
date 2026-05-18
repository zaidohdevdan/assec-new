const jwt = require('jsonwebtoken');

const userId = '07e970dc-f682-4fd2-ae63-c90af49529be';
const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';

const token = jwt.sign(
  { email: 'daniel.almeida@assec.com.br', sub: userId, role: 'USER' },
  jwtSecret,
  { expiresIn: '7d' }
);

console.log(token);
