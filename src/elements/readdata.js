import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
//import {HttpClient} from 'aurelia-http-client';
/**
 * reads data from remote url - periodically
 */
@inject(HttpClient)
export class readdata {
  @bindable display;
  @bindable url;
  @bindable timeout;

  constructor(client) {
    this.httpclient = client;
    this.continue = true;
  }
  bind() {
    this.display = this.display && (this.display === 'true');
    if (this.timeout) this.timeout = parseInt(this.timeout, 10); else this.timeout = 0;
  }

  attached() {
    if (!this.url) { console.error('expected url attribute in readdata component'); } else {
      //first update
      this.update(this);
      //set periodic update
      //let that = this;
      console.log('readdata.attached with fetch api', this.timeout);
      //
    }
  }

  update(that) {
    //this.httpclient.fetch(this.url)
    that.httpclient.fetch(that.url)
      .then(response => response.text())
      .then(text => {
        //set data that was fetched
        that.data = text;
        //console.log('readdata.update', that.data);
        //schedule next call
        //let that = this;
        if (that.timeout > 0) that.timerid = setTimeout(that.update, that.timeout, that);
      });
  }

  detached() {
    this.continue = false;
    if (this.timerid) clearInterval(this.timerid);
    console.log('readdate.detached');
  }
}
