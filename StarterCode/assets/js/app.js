const dropDownMenu = (selection, props) => {
  const {
    options,
    onOptionClicked
  } = props;
  let select = selection.selectAll('select').data([null]);
  select = select.enter().append('select')
    .merge(select)
      .on('change', function() {
        onOptionClicked(this.value)
      });

  const option = select.selectAll('option').data(options);
  option.enter().append('option')
    .merge(option)
      .attr('value', d => d)
      .text(d => d);
};

const scatterPlot = (selection, props) => {
  const {
    xValue,
    xAxisLabel,
    yValue,
    yAxisLabel,
    circleRadius,
    margin,
    width,
    height,
    data,
    svg
  } = props;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0,innerWidth])
    .nice();

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight,0])
    .nice();

  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(5);

  const g = selection.selectAll('.container').data([null]);
  const gEnter = g.enter().append('g')
    .attr('class', 'container');
  gEnter.merge(g).attr('transform',`translate(${margin.left},${margin.top})`);

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(5);

  const yAxisG = g.select('.y-Axis');
  const yAxisGEnter = gEnter.append('g')
    .attr('class','y-Axis');

  yAxisG.merge(yAxisGEnter)
      .call(yAxis).selectAll('.domain').remove();

  const yAxisLabelText = yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -20)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .text(yAxisLabel);

  const xAxisG = g.select('.x-Axis');
  const xAxisGEnter = gEnter.append('g')
    .attr('class','x-Axis');

  xAxisG.merge(xAxisGEnter)
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis).selectAll('.domain').remove();

  const xAxisLabelText = xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 30)
      .attr('fill', 'black')
    .merge(xAxisG.select('.axis-label'))
    .attr('x', innerWidth / 2)
      .text(xAxisLabel);

  const circles = g.merge(gEnter).selectAll('circle').data(data)
    .on("mouseover", mouseOver )
    .on("mouseleave", mouseLeave );

  circles.enter().append('circle').merge(circles)
    .transition().duration(750)
    .attr('cy', d => yScale(yValue(d)))
    .attr('cx', d => xScale(xValue(d)))
    .attr('r', circleRadius)
};

const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let xColumn;
let yColumn;

var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) { return `${d['state']} | ${yColumn}:${d[yColumn]} | ${xColumn}:${d[xColumn]}`;});

var mouseOver = function(d) {
  tool_tip
    .attr('opacity',1)
  console.log(`${d['state']} | ${yColumn}:${d[yColumn]} | ${xColumn}:${d[xColumn]}`)
  render();
};

var mouseLeave = function(d) {
  tool_tip
    .attr('opacity',0)
  console.log("mouseLeave")
  render();
};

const onXColumnClicked = column => {
  xColumn = column;
  render();
};

const onYColumnClicked = column => {
  yColumn = column;
  render();
};

const render = () => {
  d3.select('#xMenu').call(dropDownMenu, {
    options: data.columns,
    onOptionClicked: onXColumnClicked
  });

  d3.select('#yMenu').call(dropDownMenu, {
    options: data.columns,
    onOptionClicked: onYColumnClicked
  });

  svg.call(scatterPlot, {
    xValue: d => d[xColumn],
    xAxisLabel: xColumn,
    yValue: d => d[yColumn],
    yAxisLabel: yColumn,
    circleRadius: 9,
    margin: { top: 40, right: 20, bottom: 40, left: 100 },
    tool_tip,
    width,
    height,
    data
  });
};

d3.csv('/assets/data/data.csv').then(loadedData => {
  data = loadedData;
  data.forEach(d => {
    d.id = +d.id;
    d.age = +d.age;
    d.ageMoe = +d.ageMoe;
    d.healthcare = +d.healthcare;
    d.healthcareHigh = +d.healthcareHigh;
    d.healthcareLow = +d.healthcareLow;
    d.income = +d.income;
    d.incomeMoe = +d.incomeMoe;
    d.obesity = +d.obesity;
    d.obesityHigh = +d.obesityHigh;
    d.obesityLow = +d.obesityLow;
    d.poverty = +d.poverty;
    d.povertyMoe = +d.povertyMoe;
    d.smokes = +d.smokes;
    d.smokesHigh = +d.smokesHigh;
    d.smokesLow = +d.smokesLow;
});
  xColumn = data.columns[0];
  yColumn = data.columns[0];
  render();
});
