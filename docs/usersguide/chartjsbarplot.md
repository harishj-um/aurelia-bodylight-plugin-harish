## bdl-chartjs-barplot

barplot chart with minimum/maximum and normal range
```xml
<bdl-chartjs-barplot
  id="id11"
  fromid="id4"
  refindex="2"
  extremelimits="4,8"
  normallimits="6.9,7.1"
  initialdata="7.01"
  convertors="60,1"
  twoway="true">
</bdl-chartjs-barplot>
```
<bdl-chartjs-barplot
  id="id11"
  fromid="id4"
  refindex="2"
  extremelimits="4,8"
  normallimits="6.9,7.1"
  initialdata="7.01"
  convertors="60,1"
  twoway="true">
</bdl-chartjs-barplot>


  * `id` unique id - to this component, mandatory if registered for fmi input
  * `fromid` id refering to fmu component
  * `refindex` index in fmu outputs array - the value at this position will be visualised in barplot
  * `extremelimits` minimum and maximum to be shown in chart
  * `normallimits` physiologically normal limits as ticks in chart should be between extremelimits
  * `convertors` - same as in chartjs e.g. in form `convertors="numerator,denominator"` or expression of`x` as value e.g.:`convertors="1/x"` 
  * `twoway` - default false, if true, then click on chart will transform click position to value and dispatch change event with that value, note that fmu component have register to listen events from this component e.g. `<bdl-fmi id="id4" ... inputs="id11,16777312,1,60">`
   

Test2:   
<bdl-chartjs-barplot id="id11" fromid="id4"  refindex="2"  extremelimits="4,10"  normallimits="6.9,7.1" responsive="true"></bdl-chartjs-barplot>

Test3:
<bdl-chartjs-barplot id="id11" fromid="id4"  refindex="2"  extremelimits="4,10"  normallimits="6.9,7.1" responsive="true" labels="ph"></bdl-chartjs-barplot>

<bdl-chartjs-barplot id="id12" fromid="id4"  refindex="2"  extremelimits="4,10"  normallimits="6.9,7.1" labels=" "
initialdata="7"></bdl-chartjs-barplot>