# winston-datadog

```
yarn add https://github.com/jonaspohren/winston-datadog#v1.1.0
```

```javascript
const winston = require('winston');
const WinstonDatadog = require('winston-datadog');

const logger = winston.createLogger({
  transports: [
    new WinstonDatadog({
      apiKey: 'API_KEY',
      service: 'MY_SERVICE',
      hostname: 'MY_HOSTNAME',
      ddsource: 'node.js',
      ddtags: 'TAG1,TAG2',
    }),
  ],
});
```