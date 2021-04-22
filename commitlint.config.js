module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['Init', 'Config', 'Feat', 'Update', 'Refactor', 'Fix', 'Hotfix']],
    'type-case': [2, 'always', 'start-case'],
    'subject-case': [0],
    'subject-min-length': [2, 'always', 18],
    'subject-max-length': [2, 'always', 60],
    'subject-full-stop': [0],
    'scope-empty': [2, 'always'],
  },
}
