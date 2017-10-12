import * as d3 from 'd3';
require('./css/index.scss')
// variables

// chart margin
var margin = { top: 40, right: 60, bottom: 80, left:100},
    width  = 1000 - margin.right - margin.left, //chart width
    height = 600  - margin.top   - margin.bottom; // chart height
    

    
var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    
 
    
d3.json( url, (error,data) =>{
    
    if (error) throw error;
    
    var maxYear = d3.max(data.monthlyVariance, function(d) {return d.year}),
        minYear = d3.min(data.monthlyVariance, function(d) {return d.year}),
        maxMonth = d3.max(data.monthlyVariance, function(d) {return d.month}),
        minMonth = d3.min(data.monthlyVariance, function(d) {return d.month}),
        maxVariance  = d3.max(data.monthlyVariance, function(d) {return d.variance}),
        minVariance  = d3.min(data.monthlyVariance, function(d) {return d.variance});
    
    var maxTemp = (maxVariance + data.baseTemperature).toFixed(3),
        minTemp = (minVariance + data.baseTemperature).toFixed(3);
        
        
    var rectHeight = height / (maxMonth - minMonth + 1),
        rectWidth  = width / (maxYear - minYear + 1);
    
    // format months for Y axis
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
        
    var formatMonth = d3.scaleQuantize()
                        .domain([minMonth, maxMonth])
                        .range(months)
   
        
    
    // x scale
    var x = d3.scaleLinear()
                .domain([minYear, maxYear])
                .range([0, width])
    // y scale            
    var y = d3.scaleLinear()
                .domain([minMonth, maxMonth])
                .range([0, height-rectHeight]);
                
   
    
    // color scale
    var colors = ['#293ca5','#0b88d1','#58b0ef','#8fc4ea','#c8dcf7','#f1f2bc','#dde05c','#e0be4e','#dbb82b','#d87824','#d1200c']
        
    
    var colorScale = d3.scaleQuantile()
                        .domain([minTemp, maxTemp])
                        .range(colors)
                        
   
   
    //create tooltip
    var tooltip = d3.select('.wrapper')
                        .append('div')
                        .attr('class','tooltip')
                        .style('opacity','0');
                     
    
    //create svg 
    var svg = d3.select('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate('+margin.left+','+margin.top+')')
                    
    //create the Heat Map
    
    
    var chart = svg.selectAll('rect')
                    .data(data.monthlyVariance)
                    .enter()
                    .append('rect')
                    .attr('width',function(){return rectWidth })
                    .attr('height',function(){ return rectHeight })
                    .attr('x',function(d){ return x(d.year)})
                    .attr('y',function(d){ return y(d.month)})
                    .attr('fill',function(d){return colorScale(d.variance + data.baseTemperature)})
                    .on('mouseover',function(d){
                        var xPos = d3.event.pageX + 10 + 'px';
                        var yPos = d3.event.pageY - 15 + 'px';
                        var temp = (d.variance + data.baseTemperature).toFixed(3);
                        var month = formatMonth(d.month)
                        
                                
                        tooltip.html(`<span class="year">${d.year}  - ${month}</span><br/><span class="temp">${temp} &#8451;</span><br/><span class="variance">${d.variance} &#8451;</span>`)
                                .style('opacity','0.9')
                                .style('left',xPos)
                                .style('top',yPos);
                    })
                    .on('mouseout',function(){
                        tooltip.style('opacity','0')
                    })
                    
                    
    //add X axis
    
    var xAxis = d3.axisBottom(x);
                    
    
    svg.append('g')
        .attr('class','x axis')
        .attr('transform', 'translate(0, '+ height +')')
        .call(xAxis)
        
    svg.append('text')
        .attr('x',function(){return width / 2 - 50})
        .attr('y', function(){ return height + 50})
        .style('font-family','Tahoma')
        .style('font-size','20px')
        .style('font-weight','bold')
        .text('Years')
        
    //add Y axis
    
    var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){return formatMonth(d)})
    
    
    
    svg.append('g')
        .attr('class','y axis')
        .attr('transform','translate(0, '+(rectHeight/2)+')')
        .call(yAxis)
        
    svg.append('text')
        .attr('x',function(){return -height/2})
        .attr('y','-80')
        .style('font-size','20px')
        .style('font-family','Tahoma')
        .style('font-weight','bold')
        .attr('transform','rotate(-90)')
        .text('Months')
   
   // data legend 
   
    var legendWidth = 30,
        legendHeight = 15,
        legendTotalWidth = legendWidth * colors.length;
    
    var legend= svg.selectAll('.legend')
                    .data([0].concat(colorScale.quantiles()), function(d) {return d;})
                    .enter()
                    .append('g')
                    .attr('class','legend')
                    .attr('transform','translate('+(width-legendTotalWidth)+', '+(height+50)+')');
        
        legend.append('rect')
            .attr('class','legendRect')
            .attr('width', legendWidth)
            .attr('height',legendHeight)
            .attr('x',function(d,i){ return i*legendWidth})
            .attr('dy',legendHeight)
            .attr('fill',function(d,i){ return colors[i]})
                     
    //add lable to legend
        legend.append('text')
                .attr('class','legendLable')
                .attr('x',function(d,i){ return i*legendWidth })
                .attr('y',legendHeight * 2 )
                .text(function(d){return Math.floor(d*10) / 10})
    
    
   
                     
                     
    
    
});
    