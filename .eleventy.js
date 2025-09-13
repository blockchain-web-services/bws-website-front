module.exports = function(eleventyConfig) {
  // Return configuration
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    htmlTemplateEngine: "njk"
  };
};