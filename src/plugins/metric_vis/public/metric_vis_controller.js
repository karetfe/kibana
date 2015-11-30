define(function (require) {
  // get the kibana/metric_vis module, and make sure that it requires the "kibana" module if it
  // didn't already
  var module = require('ui/modules').get('kibana/metric_vis', ['kibana']);

  module.controller('KbnMetricVisController', function ($scope, Private) {
    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));

    var metrics = $scope.metrics = [];

    $scope.processTableGroups = function (tableGroups) {
      tableGroups.tables.forEach(function (table) {
        table.columns.forEach(function (column, i) {
          var fieldFormatter = table.aggConfig(column).fieldFormatter();
          var value = table.rows[0][i];

          // Return string when value is '?'
          value = typeof value === 'string' ? value : fieldFormatter(value);

          metrics.push({
            label: column.title,
            value: value
          });
        });
      });
    };

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        metrics.length = 0;
        $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
      }
    });
  });
});
