exports.success = (req, res) => {
  res.status(200).json({
    message: "Google Auth Success",
    user: req.user
  });
};

exports.failure = (req, res) => {
  res.status(401).json({
    message: "Google Auth Failed"
  });
};
