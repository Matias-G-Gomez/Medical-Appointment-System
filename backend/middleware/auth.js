// Token JWT

// Importo libería jsonwebtoken para manejar tokens JWT
const jwt = require('jsonwebtoken');

// Middleware para verificar que el usuario está autenticado
const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        // '?' --> Si no existe Authorization, no tira error
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
        }

        // Verifica que el token sea válido y  lo decodifica
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agrega la info del usuario al request
        req.user = decoded;
        
        // Continua con la siguiente función
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar que el usuario es admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo .' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };