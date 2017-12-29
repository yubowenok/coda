/**
 * @fileoverview Format directive for text shown with MarkDown and MathJax.
 * MathJax escapes in MarkDown:
 *   inlineMath: $$ ... $$
 *   displayMath: $$$ ... $$$
 */

coda.directive('format', function() {
  return {
    restrict: 'E',
    controller: ['$scope', '$element', '$attrs',
      function($scope, $element, $attrs) {
        /**
         * @type {{
         *   textBind: *
         * }}
         */
        var attrs = $attrs;
        $scope.$watch(attrs.textBind, function(text) {
          var converter = new showdown.Converter();
          var html = converter.makeHtml(text);
          $element.html(html);
          MathJax.Hub.Queue(['Typeset', MathJax.Hub, $element[0]]);
        });
      }]
  };
});
