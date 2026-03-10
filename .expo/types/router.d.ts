/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/modals/quick-memo`; params?: Router.UnknownInputParams; } | { pathname: `/people`; params?: Router.UnknownInputParams; } | { pathname: `/people/new`; params?: Router.UnknownInputParams; } | { pathname: `/reminders`; params?: Router.UnknownInputParams; } | { pathname: `/people/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/modals/quick-memo`; params?: Router.UnknownOutputParams; } | { pathname: `/people`; params?: Router.UnknownOutputParams; } | { pathname: `/people/new`; params?: Router.UnknownOutputParams; } | { pathname: `/reminders`; params?: Router.UnknownOutputParams; } | { pathname: `/people/[id]`, params: Router.UnknownOutputParams & { id: string; } };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/modals/quick-memo${`?${string}` | `#${string}` | ''}` | `/people${`?${string}` | `#${string}` | ''}` | `/people/new${`?${string}` | `#${string}` | ''}` | `/reminders${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/modals/quick-memo`; params?: Router.UnknownInputParams; } | { pathname: `/people`; params?: Router.UnknownInputParams; } | { pathname: `/people/new`; params?: Router.UnknownInputParams; } | { pathname: `/reminders`; params?: Router.UnknownInputParams; } | `/people/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ''}` | { pathname: `/people/[id]`, params: Router.UnknownInputParams & { id: string | number; } };
    }
  }
}
