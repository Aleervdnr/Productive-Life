export const isTester = (req, res, next) => {
    if (req.user?.isTester) return next();
    return res.status(403).json({ error: "Access denied. Tester only." });
  };
  
  export const isAdmin = (req, res, next) => {
    if (req.user?.role === "admin") return next();
    return res.status(403).json({ error: "Access denied. Admin only." });
  };