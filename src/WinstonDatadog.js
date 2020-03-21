const https = require('https');
const Transport = require('winston-transport');

class WinstonDatadog extends Transport {
  constructor(opts) {
    super(opts);

    this.bulk = [];
    this.timer = null;
    this.options = {
      hostname: 'http-intake.logs.datadoghq.com',
      port: 443,
      path: `/v1/input/${opts.apiKey}?ddtags=${opts.ddtags}&ddsource=${opts.ddsource}&service=${opts.service}&hostname=${opts.hostname}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    this.bulk.push(info);

    if (this.timer === null) {
      this.timer = setTimeout(() => {
        const request = https.request(this.options);

        request.write(JSON.stringify(this.bulk));
        request.end();

        this.bulk = [];
        this.timer = null;
      }, 1000);
    }

    callback();
  }
}

module.exports = WinstonDatadog;
