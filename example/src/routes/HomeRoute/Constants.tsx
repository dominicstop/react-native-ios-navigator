
import { RouteKeys } from '../../constants/Routes';


export const RouteItems = [{ 
  routeKey: RouteKeys.NavigatorShowcase01,
  title: 'Music Playlist',
  desc: 'A route showing a playlist with a list of tracks.'
}, { 
  routeKey: RouteKeys.NavigatorShowcase02,
  title: 'Profile',
  desc: 'A route showing a generic profile layout.'
}, { 
  routeKey: RouteKeys.NavigatorShowcase03,
  title: 'Filter List',
  desc: 'A route with a list of items with filter controls in the navigation bar.'
}, { 
  routeKey: RouteKeys.NavigatorExample01,
  title: 'Basic Nested',
  desc: 'Nested navigator example w/ basic navigation (e.g. push and pop).',
}, {
  routeKey: RouteKeys.NavigatorTest01,
  title: 'Navbar Config',
  desc: (
      `Test for all the different ways a navigator bar can be configured,`
    + ` e.g. this is a test for setting/updating the 'RouteOptions'.`
  ),
}, {
  routeKey: RouteKeys.NavigatorTest02,
  title: 'Navbar Custom Title',
  desc: (
      `Test for showing a custom nav. bar title item and testing whether it`
    + ` updates property when the props updates.`
  )
}, { 
  routeKey: RouteKeys.NavigatorTest03,
  title: 'Navigation Commands',
  desc: (
      `Tester for all the navigation commands currently supported, e.g.`
    + ` push, pop, 'popToRoot', etc.`
  )
}, { 
  routeKey: RouteKeys.NavigatorTest04,
  title: 'Push/Pop Transitions',
  desc: (
      `Tester for the preset transitions that can be used for the push and pop`
    + ` navigation commands.`
  )
}, {
  routeKey: RouteKeys.NavigatorTest05,
  title: 'Multiple Initial Routes',
  desc: (
      `Tester for the 'initialRoutes' prop, e.g. testing setting multiple react and`
    + ` native routes on first mount.`
  )
}, {
  routeKey: RouteKeys.NavigatorTest06,
  title: 'Route Header Test #1',
  desc: `Tester for a route with a 'RouteHeaderView' that expands`
}, {
  routeKey: RouteKeys.NavigatorTest07,
  title: 'Route Header Test #2',
  desc: `Tester for a route with a 'RouteHeaderView' that's fixed.`
}, {
  routeKey: RouteKeys.NavigatorTest08,
  title: 'RouteViewEvents Test',
  desc: (
      `Tester for listening to the different route view events via`
    + `the RouteViewEvents component`
  )
}, {
  routeKey: RouteKeys.NavigatorTest09,
  title: 'Search Tester',
  desc: 'Tester for configuring a route that has a search bar',
}, { 
  routeKey: RouteKeys.NavigatorDemo01,
  title: 'Navigator Nested Layout',
  desc: (
      `Automatic demo for showing nested navigators in varying configurations`
    + ` any layout. Also tests whether the 'push'/'pop' can be chained together`
    + ' via async/await + nav. events.'
  )
}, { 
  routeKey: RouteKeys.NavigatorDemo02,
  title: 'Navigator Recursive Nest',
  desc: (
      `Automatic demo for showing nested navigators, specifically this demos`
    + ` a customized nav. bar and tests whether they layout properly when they're`
    + ` continuously stacked/nested on top of one another.`
    + ` This also tests functional usage + hooks.`
  )
}, { 
  routeKey: RouteKeys.RouteViewPortalExample01,
  title: 'RouteViewPortal Example'
}, { 
  routeKey: RouteKeys.GettingStartedGuide,
  title: 'GettingStartedGuide'
}];

