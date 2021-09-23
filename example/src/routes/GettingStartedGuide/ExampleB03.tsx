import * as React from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

import * as Colors from '../../constants/Colors';

type ExampleProps = RouteContentProps<{
  count?: number;
}>;

function ExampleRoute(props: ExampleProps){
  // Get the count from the prev. route.
  const prevCount = props.navigation.routeProps?.count ?? 0;

  // Save the count to state
  const [count] = React.useState(prevCount);

  return (
    <SafeAreaView style={styles.routeContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Push route when this button is pressed...
          props.navigation.push({
            routeKey: 'routeA',
            routeProps: {
              // ... and send the count to the next route
              count: count + 1,
            },
            routeOptions: {
              routeTitle: `Count: ${count}`
            },
          });
        }}
      >
        <Text style={styles.buttonText}> 
          {`Push and Increment Counter`}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function ExampleB03(){
  return (
     <NavigatorView
      routes={{
        routeA: {
          renderRoute: () => (
            <ExampleRoute/>
          ),
        }
      }}
      initialRoutes={[{routeKey: 'routeA'}]}
    />
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: Colors.PURPLE.A700,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
});