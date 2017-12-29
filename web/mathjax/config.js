/**
 * @fileoverview Configuration of MathJax.
 */

MathJax.Hub.Config({
  tex2jax: {
    inlineMath: [['$$', '$$'], ['\\(', '\\)']],
    displayMath: [['$$$', '$$$'], ['\\[', '\\]']],
    skipTags: ['textarea', 'pre', 'code']
  }
});
