# ReadData

```
<bdl-readdata 
  id="id11" 
  url="http://localhost:5000/devicedata" 
  display="true" 
  timeout="1000">
</bdl-readdata>
```

Reads data from `url` every `timeout` milliseconds, displays data in a view if `display="true"` otherwise the view is hidden and the value might be used 
as an input for fmi component.
The endpoint should have CORS enabled - return HTTP headers 'Access-Control-Allow-Origin = '*' and 'Access-Control-Allow-Methods' = 'GET'

Demo:

<bdl-readdata id="id11" url="http://localhost:5000/devicedata" display="true" timeout="500"></bdl-readdata>
