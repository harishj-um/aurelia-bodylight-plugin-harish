import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
//import {HttpClient} from 'aurelia-fetch-client';
import {HttpClient} from 'aurelia-http-client';
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
    if (!this.url) { console.error('expected url attribute in readdata component'); } else {
      //first update
      this.update();
    }
    if (this.timeout) this.timeout = parseInt(this.timeout, 10); else this.timeout = 1;
    if (this.timeout === 0) this.timeout = 1;
  }

  update() {
    //this.httpclient.fetch(this.url)
    let that = this;
    this.httpclient.get(this.url)
      //.then(response => response.text())
      .then(text => {
        //set data that was fetched
        that.data = text;
        //set periodic update
        if (that.continue) that.timerid = setTimeout(that.update(), that.timeout * 1000);
      });
  }
  unbind() {
    this.continue = false;
    clearTimeout(this.timerid);
  }
}
