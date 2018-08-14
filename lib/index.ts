import * as request from 'request';
import * as CachedRequest from 'cached-request';
const { StringDecoder } = require('string_decoder');

const cachedRequest = CachedRequest(request);

function CachedHTTPClient(...args: any[]){
  const stringDecoder = new StringDecoder('utf-8');

  return new Promise((resolve, reject) => {
    cachedRequest(...args, (err: any, response: request.Response) => {
      if(err) return reject(err);
      const cacheHeader: any = Array.isArray(response.headers['x-from-cache']) ? 
        response.headers['x-from-cache'][0] : response.headers['x-from-cache'];
      if(parseInt(cacheHeader) === 1) {
        response.body = stringDecoder.write(response.body);
        stringDecoder.end();
      }
      return resolve(response);
    })
  })
}

module.exports = CachedHTTPClient;