d3.csv("assets/data/data.csv", type, function(myArrayOfObjects) {
  myArrayOfObjects.forEach(function (d) {
    console.log(d.abbr, + ', ' + d.poverty);
  });
});
