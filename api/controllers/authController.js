const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/config');

const login = (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '200h' });

    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
};

module.exports = {
  login,
};
