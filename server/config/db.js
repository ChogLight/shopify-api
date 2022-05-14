require('dotenv').config();
module.exports = {
    "URI": process.env['MONGODB_URL'],
    "Secret": 'SomeSecret'
  };

exports.Secret = "NotSoSecrete";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostName = exports.Secret = exports.RemoteURI = exports.LocalURI = void 0;
exports.LocalURI = "mongodb://localhost:27017/shopify";
exports.HostName = "localhost";