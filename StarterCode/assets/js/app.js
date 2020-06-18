// const dropDownMenu = (selection, props) => {
//   const {
//     options
//   } = props;
//   let select = selection.selectAll('select').data([null]);
//   select = select.enter().append('select').merge(select);
//
//   const option = select.selectAll('option').data(options);
//   option.enter().append('option')
//     .merge(option)
//       .attr('value', d => d)
//       .text(d => d);
// };
//
// d3.select('#menus').call(dropDownMenu, {
//   options: ['A','B','C']
// });

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
  const title = 'Smoking vs Lifespan';

  const xValue = d => d.age;
  const xAxisLabel = 'Lifespan';

  const yValue = d => d.smokes;
  const yAxisLabel = 'Number of Cigarettes';

  const circleRadius = 9;

  const margin = { top: 50, right: 40, bottom: 40, left: 100 };
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

  const g = svg.append('g')
    .attr('transform',`translate(${margin.left},${margin.top})`);

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(5);

  const yAxisG = g.append('g').call(yAxis);
  yAxisG.selectAll('.domain').remove();

  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', -innerHeight / 2)
    .attr('y', -20)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.select('.domain').remove();

  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 30)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .text(xAxisLabel);

  g.selectAll('circle').data(data)
    .enter().append('circle')
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleRadius);

  g.append('text')
    .attr('class','title')
    .attr('x', innerWidth / 2)
    .attr('y',-10)
    .attr('text-anchor', 'middle')
    .text(title);
};

d3.csv('/assets/data/data.csv').then(data => {
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
  render(data);
  console.log(data)
});
