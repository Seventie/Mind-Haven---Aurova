module.exports = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.log('❌ No user in request');
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            console.log(`❌ Role ${req.user.role} not in allowed roles:`, allowedRoles);
            return res.status(403).json({
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
            });
        }

        console.log(`✅ Role check passed: ${req.user.role}`);
        next();
    };
};
