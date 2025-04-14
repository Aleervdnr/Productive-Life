export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ code: "auth.not_admin" });
  next();
};

export const isTester = (req, res, next) => {
  if (req.user.role !== "tester" && req.user.role !== "admin")
    return res.status(403).json({ code: "auth.not_tester" });
  next();
};
