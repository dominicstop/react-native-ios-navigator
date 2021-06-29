# react-native-ios-navigator
A native wrapper component around `UINavigationController` for react-native

## 🚧⚠️ **Library WIP** ⚠️🚧
Currently in development... 😅 (See [TODO.md](https://github.com/dominicstop/react-native-ios-navigator/blob/master/docs/TODO.md) for current progress).



[TOC]



---

<br><br>

## A. Introduction

------

<br><br>

## B. Installation

```sh
# install via npm
npm install react-native-ios-navigator

# install via yarn
yarn add react-native-ios-navigator

# then run pod install (uses auto-linking)
cd ios && pod install
```



------

<br><br>

## C. Basic Usage

```react
import { SafeAreaView, TouchableOpacity, Text } from 'react-native-ios-navigator';
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

export function App() {
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

------

<br><br>

## D. Documentation

<br><br>

## E. Getting Started Guide

Lorum ipsum

------

<br><br>

## F. Usage and Examples

Lorum ipsum

------

<br><br>

## G. Tests and Demos

Lorum ipsum

------

<br><br>

## H. Meta

Lorum ipsum

------

<br><br>

## I. License

MIT