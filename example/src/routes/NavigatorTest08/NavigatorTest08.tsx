import * as React from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';

import { RouteViewPortal, RouteContentProps, NavigatorView, RouteViewEvents, NavRoutesConfigMap } from 'react-native-ios-navigator';

import { EventListItem } from './EventListItem';
import { RouteA } from './RouteA';
import { RouteB } from './RouteB';

import type { EventData, RecordEvent, RouteProps } from './SharedTypes';

export const RouteKeys = {
  RouteA: 'RouteA',
  RouteB: 'RouteB',
};

const ROUTES: NavRoutesConfigMap = {
  [RouteKeys.RouteA]: {
    routeOptionsDefault: {
      largeTitleDisplayMode: 'never',
    },
    renderRoute: () => (
      <RouteA/>
    ),
  },
  [RouteKeys.RouteB]: {
    routeOptionsDefault: {
      largeTitleDisplayMode: 'never',
    },
    renderRoute: () => (
      <RouteB/>
    ),
  },
};

type NavigatorTest08State = {
  events: Array<EventData>;
};


export class NavigatorTest08 extends React.Component<RouteContentProps, NavigatorTest08State> {
  
  constructor(props: RouteContentProps){
    super(props);

    this.state = {
      events: [],
    };
  };

  _handleRecordEvent: RecordEvent = (event) => {
    this.setState((prevState) => ({
      events: [event, ...prevState.events],
    }));
  };

  _handleKeyExtractor = (item: EventData) => {
    return `${item.timestamp}`;
  };

  _renderEventListItem: ListRenderItem<EventData> = ({item, index}) => {
    const { events } = this.state;
    const eventCount = events.length;

    return(
      <EventListItem
        index={(eventCount - 1) - index}
        eventListItem={item}
      />
    );
  };

  render(){
    const sharedRouteProps: RouteProps = {
      recordEvent: this._handleRecordEvent,
    };

    return(
      <React.Fragment>
        <RouteViewPortal
          routeOptions={{
            navBarButtonRightItemsConfig: [{
              type: 'TEXT',
              title: 'Clear'
            }]
          }}
        />
        <RouteViewEvents
          onPressNavBarRightItem={() => {
            this.setState({
              events: [],
            });
          }}
        />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={this.state.events}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderEventListItem}
        />
        <NavigatorView
          style={styles.bottomNavigator}
          sharedRouteProps={sharedRouteProps}
          routes={ROUTES}
          initialRoutes={[{routeKey: 'RouteA'}]}
        />
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bottomNavigator: {
    flex: 1,
  },
}); 
