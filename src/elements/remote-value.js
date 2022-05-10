import {HttpClient} from 'aurelia-fetch-client';
import {inject,bindable} from "aurelia-framework";

@inject(HttpClient)
export class RemoteValue {
    value;
    @bindable remoteurl;
    @bindable started = false;
    remotevalue;
    @bindable remoteheader='x-api-key';
    @bindable remoteheadervalue='';
    postvalue='';
    @bindable interval = 0;
    @bindable id;
    starttime;

    constructor(httpclient) {
        this.client = httpclient;
        this.handleTick = () => {
            //do periodic stuff
            this.get();
            //schedule next tick
            if (this.fetchinterval>0) setTimeout(this.handleTick.bind(this),this.fetchinterval);
        }
    }

    bind(){
        if (this.id) {
            //will generate fmidata event
        }
        if (typeof this.started === 'string') {
            this.started = this.started === 'true';
        }
    }

    attached() {
        this.time = new Date();
        this.starttime = Math.round(this.time.getTime() /1000);
        this.remoteurl =         localStorage.getItem('bdl-fhir-url');
        this.remoteheadervalue = localStorage.getItem('bdl-fhir-api-key');
        if (typeof(interval) === 'string'){
            this.interval = parseInt(this.interval)

        }
    }

    intervalChanged(newValue,oldValue) {
        //triggered by aurelia fw when getinterval is changed
        if (typeof(this.interval) === 'string'){
            this.interval = parseInt(this.interval)
        }
    }

    start(){
        //this.get();
        this.started = ! this.started;
        if (this.started) {
            this.fetchinterval = this.interval;
            setTimeout(this.handleTick.bind(this), this.fetchinterval);
        } else  {this.fetchinterval = 0;}
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
                if (this.id) {
                    //generatefmidata event
                    let mydata =[];
                    let mytime = (Math.round((new Date()).getTime() /100) - (this.starttime*10))/10;
                    if (typeof this.remotevalue === 'object') {
                        for (let key of Object.keys(this.remotevalue)) mydata.push(this.remotevalue[key]);
                    }
                    else if (typeof this.remotevalue === 'number') {mydata.push(this.remotevalue)}
                    let event = new CustomEvent('fmidata', {detail: {time: mytime, data: mydata}});
                    document.getElementById(this.id).dispatchEvent(event);
                }
            })
            .catch(err =>{console.log('error',err);this.fetchinterval=0;});
        /*this.client.get(this.remoteurl)
            .then(response => response.json())// do response.json() for json result
            .then(data => {
                //console.log('markdownaurelia fetched md:', data)
                this.remotevalue = data;
                this.remotevalueformatted = JSON.stringify(this.remotevalue,null,4)
            });*/
    }

    round(value, decimals) {
        if (decimals < 0) {let posdecimals = -decimals; return Number(Math.round(value + 'e' + posdecimals) + 'e-' + posdecimals);}
        return Number(Math.round(value + 'e-' + decimals) + 'e+' + decimals);
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
