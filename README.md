# react-native-ios-navigator
A native wrapper component around `UINavigationController` for react-native

## 🚧⚠️ **Library WIP** ⚠️🚧
Currently in development... 😅 (See [TODO.md](https://github.com/dominicstop/react-native-ios-navigator/blob/master/docs/TODO.md) for current progress).

---

## Installation

```sh
# install via npm
npm install react-native-ios-navigator

# install via yarn
yarn add react-native-ios-navigator

# then run pod install (uses auto-linking)
cd ios && pod install
```

## Usage

```js
import { NavigatorView } from 'react-native-ios-navigator';

function ExampleRoute(props){
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => {
        props.navigation.push({
          routeKey: 'routeA'
        });
      }}>
        <Text> Push: 'RouteA' </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function HelloWorld() {
  return(
    <NavigatorView
      initialRoutes={[{routeKey: 'routeA'}]}
      routes={[{
        routeKey: 'routeA',
        routeOptionsDefault: {
          routeTitle: 'Route A',
        },
        renderRoute: () => (
          <ExampleRoute/>
        ),
      }]}
    />
  );
};

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT