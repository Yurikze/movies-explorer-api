class NotValidError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotValidError';
    this.statusCode = 400;
  }
}

module.exports = { NotValidError };
