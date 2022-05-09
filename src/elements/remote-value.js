import {HttpClient} from 'aurelia-fetch-client';
import {inject,bindable} from "aurelia-framework";

@inject(HttpClient)
export class RemoteValue {
    value;
    @bindable remoteurl;
    remotevalue;
    @bindable remoteheader='x-api-key';
    @bindable remoteheadervalue='';
    postvalue='';
    @bindable fetchinterval = 0;

    constructor(httpclient) {
        this.client = httpclient;
        this.handleTick = () => {
            //do periodic stuff
            this.get();
            //schedule next tick
            if (this.fetchinterval>0) setTimeout(this.handleTick.bind(this),this.fetchinterval);
        }
    }

    attached() {
        this.remoteurl =         localStorage.getItem('bdl-fhir-url');
        this.remoteheadervalue = localStorage.getItem('bdl-fhir-api-key');
        if (typeof(getinterval) === 'string'){
            this.fetchinterval = parseInt(this.fetchinterval)

        }
    }

    fetchintervalChange(newValue,oldValue) {
        //triggered by aurelia fw when getinterval is changed
        if (typeof(this.fetchinterval) === 'string'){
            this.fetchinterval = parseInt(this.fetchinterval)
        }
    }

    start(){
        this.get();
        if (this.fetchinterval>0) setTimeout(this.handleTick.bind(this),this.fetchinterval);
    }

    get() {
        //sends GET request to
        let myheaders = new Headers();
        localStorage.setItem('bdl-fhir-url',this.remoteurl);
        if(this.remoteheadervalue && this.remoteheadervalue.length >0 ) {
            myheaders.append(this.remoteheader,this.remoteheadervalue);
            localStorage.setItem('bdl-fhir-api-key',this.remoteheadervalue);
        }
        this.client.fetch(this.remoteurl, {headers: myheaders})
            .then(response => response.json())// do response.json() for json result
            .then(data => {
                //console.log('markdownaurelia fetched md:', data)
                this.remotevalue = data;
                this.remotevalueformatted = JSON.stringify(this.remotevalue,null,4)
            })
            .cath(err =>{console.log('error',error);this.fetchinterval=0;});
        /*this.client.get(this.remoteurl)
            .then(response => response.json())// do response.json() for json result
            .then(data => {
                //console.log('markdownaurelia fetched md:', data)
                this.remotevalue = data;
                this.remotevalueformatted = JSON.stringify(this.remotevalue,null,4)
            });*/
    }
    post() {
        //sends GET request to
        let myheaders = new Headers();
        myheaders.append('Accept','application/json');
        myheaders.append('Content-Type','application/json')
        localStorage.setItem('bdl-fhir-url',this.remoteurl);
        if(this.remoteheadervalue && this.remoteheadervalue.length >0 ) {
            myheaders.append(this.remoteheader,this.remoteheadervalue);

            localStorage.setItem('bdl-fhir-api-key',this.remoteheadervalue);
        }
        this.client.fetch(this.remoteurl, { method: 'post',headers: myheaders, body:this.postvalue})
            .then(response => response.json())// do response.json() for json result
            .then(data => {
                //console.log('markdownaurelia fetched md:', data)
                this.remotevalue = data;
                this.remotevalueformatted = JSON.stringify(this.remotevalue,null,4)
            });
        /*this.client.get(this.remoteurl)
            .then(response => response.json())// do response.json() for json result
            .then(data => {
                //console.log('markdownaurelia fetched md:', data)
                this.remotevalue = data;
                this.remotevalueformatted = JSON.stringify(this.remotevalue,null,4)
            });*/
    }
}
