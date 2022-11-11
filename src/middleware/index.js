function formatGenreInput(req, res, next) {
  req.params.category = req.params.category.toLowerCase();
  req.params.category = req.params.category.replace(
    req.params.category.charAt(0),
    req.params.category.charAt(0).toUpperCase()
  );
  next();
}

module.exports = formatGenreInput;
