### Animate objects exported from Adobe Animate 
This objects uses createJS library in order to control animation

**`bdl-animate-adobe`** renders the exporeted animation into the place

```xml
<bdl-animate-adobe 
    src="doc/ZelezoCelek.js" 
    width="800"
    height="600"
    name="ZelezoCelek"
    fromid="id4" ></bdl-animate-adobe> 
``` 
* `src` - exported JS file from Adobe Animate
* `width` - width of the canvas (default 800px)
* `height` - height of the canvas (default 600px)
* `name` - name of the object exported in JS 
* `fromid` - component giving the data to animate.

**`bdl-animate-adobe-control`** displays play/stop and step button in order to control reffered animation.
Sends custom events `animatestart` and `animatestop`. The target elements should listen these events, usually by specifying `fromid`.
```xml
<bdl-animate-adobe-control
   id="id4"></bdl-animate-adobe-control>
   
```

Example:

<bdl-animate-adobe-control id="id4"></bdl-animate-adobe-control>

<bdl-animate-adobe 
    src="doc/ZelezoCelek.js" 
    width="800"
    height="600"
    name="ZelezoCelek"
    fromid="id4" ></bdl-animate-adobe>

    