### Range, bdl-range
`<bdl-range>` Renders a range input which may trigger a value. With following attributes:
  * `id` unique id
  * `min`, `max` minimum and maximum range value (default 0,100)
  * `step`, step between the range values (default 1)
  * `default`, default value of the range component (default 50)

Example:
  * `<bdl-range id="id1" min="10" max="20" step="2" default="12"></bdl-range>` will render range from 10 to 20 with default value 12 and step 2.
  *  <bdl-range id="id1" min="10" max="20" step="2" default="12"></bdl-range>  

### Range 2 range binding value
E.g. setting range 1 will change range 2 and range 3 so the sum is constant:

```xml
O2: <bdl-range id="id3" min="0" max="100" step="1" default="21" ids="id4,id5" convertors="100-2-x;2"></bdl-range>
N:<bdl-range id="id4" min="0" max="100" step="1" default="77" ids="id3,id5" convertors="100-2-x;2"></bdl-range>
other:<bdl-range id="id5" min="0" max="100" step="1" default="2" ids="id3,id4" convertors="21;100-21-x"></bdl-range>

```

O2: <bdl-range id="id3" min="0" max="100" step="1" default="21" ids="id4,id5" convertors="100-2-x;2"></bdl-range>
N:<bdl-range id="id4" min="0" max="100" step="1" default="77" ids="id3,id5" convertors="100-2-x;2"></bdl-range>
other:<bdl-range id="id5" min="0" max="100" step="1" default="2" ids="id3,id4" convertors="21;100-21-x"></bdl-range>
