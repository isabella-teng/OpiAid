import { NetInfo, Platform, NativeModules } from 'react-native';

import { store } from '../App';

const isAndroidDev = Platform.OS === 'android' && __DEV__;
const ANDROID_EMULATOR_LOCAL = 'http://10.0.2.2';
const IOS_LOCAL = 'http://0.0.0.0';

const HOST = isAndroidDev ? ANDROID_EMULATOR_LOCAL : IOS_LOCAL;

const authHeader = () => {
  // append session cookie to headers
  // semicolon in session string is a hacky fix to the following issue:
  //   when the semicolon isn't there, the server receives
  //     Cookie: _ga=GA1.2.1498112279.1514889198;
  //             __cfduid=d93f8879a63891915d6bc0429440768181514889197,session=.eJwl...
  //   when the semicolon is there, the server receives
  //     Cookie: _ga=GA1.2.1498112279.1514889198;
  //             __cfduid=d93f8879a63891915d6bc0429440768181514889197,;session=.eJwl...
  //   so 1) fixme: a comma is added to cfduid, which we should fix
  //   and 2) the semicolon enables the server to receive the session cookie
  const { user } = store.getState() || {};
  const { session } = user || {};
  const headers = new Headers();
  headers.append('cookie', `session=${session}`);
  return headers;
};

const getJSON = async (res, route) => {
  let text, json, err;

  // try extracting json from response
  try {
    text = await res.text();
    json = JSON.parse(text);
  } catch(e) {
    err = e;
  }

  // if error, fetch connection status
  let isConnected = true;
  if (err || !json || json.status !== 'success') {
    const { type: connectionType } = await NetInfo.getConnectionInfo();
    if (connectionType !== 'unknown') isConnected = await NetInfo.isConnected.fetch();
  }

  if (!isConnected) {
    console.log('not connected');
    json = { status: 'fail', message: 'No internet connection' }
  } else if (err) {
    if (text) {
      // Format of flask error traceback for more helpful error message
      const htmlIdx = text.indexOf('</html>');
      const tbText = htmlIdx > -1 ? text.slice(htmlIdx) : '';
      const traceIdx = tbText.indexOf('Traceback');
      text = traceIdx > -1 ? tbText.slice(traceIdx) : text;
    }
    console.warn(`Error extracting json from route ${route}.\n${err}\n>>>>> Response:\n${text || res}`);
    json = { status: 'fail', message: 'Request returned invalid JSON' };
  }

  console.log(`gotJson | ${route} | ${json.status}`);

  return json;
};

const clearCookies = () => {
  if (Platform.OS === 'android') NativeModules.Networking.clearCookies(() => {});
};


const get = async (route) => {
  let res = null;
  try {
    clearCookies();
    res = await fetch(`${HOST}${route}`, {
      method: 'GET',
      headers: authHeader(),
      credentials: 'include'
    });
  } catch (err) {
    console.warn(`Error making GET to ${route}: ${err}`);
  }

  return getJSON(res, route);
};

const post = async (route, data, files, options = {}) => {
  console.log('posting |', route, files, 40);
  const headers = authHeader();
  let res = null;
  let body;
  const fileList = files && Object.entries(files).filter(([key, f]) => !!f);
  if (fileList && fileList.length > 0) {
    body = new FormData();

    fileList.forEach(([key, fs]) => {
      if (Array.isArray(fs)) {
        fs.forEach(f => body.append(key, f));
      } else {
        body.append(key, fs);
      }
    });

    body.append("multiform_data", JSON.stringify(data));
    headers.append('Content-Type', 'multipart/form-data');
  } else {
    headers.append('Content-Type', 'application/json');
    body = JSON.stringify(data);
  }

  try {
    clearCookies();
    res = await fetch(`${HOST}${route}`, {
      ...options,
      method: 'POST',
      headers,
      body
    });
  } catch (err) {
    console.warn(`Error making POST to ${route} with data ${JSON.stringify(data)}: ${err}`);
  }

  return getJSON(res, route);
};

const memoizeLast = (f, isEqual = (a, b) => a === b) => {
  let oldThis, oldArgs, oldResult, alreadyCalled;
  const isArgEqual = (arg, index) => isEqual(arg, oldArgs[index]);
  const sameArgs = args => args.length === oldArgs.length && args.every(isArgEqual);

  return function (...args) {
    if (!alreadyCalled || oldThis !== this || !sameArgs(args)) {
      ([alreadyCalled, oldThis, oldArgs] = [true, this, args]);
      oldResult = f.apply(this, args);
    }
    return oldResult;
  };
};

export {
  post,
  get,
  memoizeLast
}
