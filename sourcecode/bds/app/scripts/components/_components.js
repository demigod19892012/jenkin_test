angular.module('app.components', [
    'app.events.routers',
    'app.events.translate',

    'app.interceptor.httpProvider',

    'app.config.translate',
    'app.config.googleMap',

    'app.constants',

    'app.session.user',
    'app.router',
    'app.template',
    'app.appState',
    'app.api',
    'app.search',

    'app.directives.adminLoginForm',
    'app.directives.appLeftPanel',
    'app.directives.bdsSearch'
  ]
);
