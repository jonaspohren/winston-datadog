const https = require('https');
const Transport = require('winston-transport');

class WinstonDatadog extends Transport {
  constructor(opts) {
    super(opts);

    this.logs = [];
    this.sendTimer = null;
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

    while (this.logs.length >= 1000) {
      this.logs.shift();
    }

    this.logs.push(info);

    if (this.sendTimer === null) {
      this.sendTimer = setTimeout(() => {
        this.sendLogs();
      }, 1000);
    }

    callback();
  }

  sendLogs() {
    const request = https.request(this.options, (response) => {
      if (response.statusCode === 200) {
        this.logs = [];
        this.sendTimer = null;
      } else {
        this.sendTimer = setTimeout(() => {
          this.sendLogs();
        }, 10000);
      }
    });

    request.write(JSON.stringify(this.logs));
    request.end();
  }
}

module.exports = WinstonDatadog;
