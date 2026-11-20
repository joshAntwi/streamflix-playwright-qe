// Native Cucumber runner. This is independent of playwright.config.ts.
export default {
    paths: ['features/**/*.feature'],
    import: [
      './tsx-register.mjs',
      'support/world.ts',
      'support/hooks.ts',
      'steps/**/*.ts',
    ],
    format: [
      'progress',
      'html:reports/cucumber.html',
      'json:reports/cucumber.json',
    ],
    tags: 'not @wip',
    parallel: 0,
};
