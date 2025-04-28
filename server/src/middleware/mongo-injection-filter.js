// mongo-injection-filter.js
function sanitizeInput(req, res, next) {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
}

module.exports = { sanitizeInput };