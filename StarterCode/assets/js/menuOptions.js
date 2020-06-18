export const dropDownMenu = (selection, props) => {
  const {
    options
  } = props;
  let select = selection.selectAll('select').data([null]);
  select = select.enter().append('select').merge(select);

  const option = select.selectAll('option').data(options);
  option.enter().append('option').merge(option)
    .attr('value', d => d)
    .attr('text', d => d);
};
