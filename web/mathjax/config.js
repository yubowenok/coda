/**
 * @fileoverview Configuration of MathJax.
 */

(function() {
  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$$', '$$'], ['\\(', '\\)']],
      displayMath: [['$$$', '$$$'], ['\\[', '\\]']],
      skipTags: ['textarea', 'pre', 'code']
    }
  });
}());
