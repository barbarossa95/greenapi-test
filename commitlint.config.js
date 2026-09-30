export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [
      2,
      'always',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
  },
};

// main: The main development branch (e.g., main, master, or develop)
// feature/: For new features (e.g., feature/add-login-page)
// bugfix/: For bug fixes (e.g., bugfix/fix-header-bug)
// hotfix/: For urgent fixes (e.g., hotfix/security-patch)
// release/: For branches preparing a release (e.g., release/v1.2.0)
// chore/: For non-code tasks like dependency, docs updates (e.g., chore/update-dependencies)
