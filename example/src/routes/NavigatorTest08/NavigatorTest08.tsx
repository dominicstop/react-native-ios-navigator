import * as React from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';

import { RouteViewPortal, RouteContentProps, NavigatorView, NavRouteConfigItem, RouteViewEvents } from 'react-native-ios-navigator';

import { EventListItem } from './EventListItem';
import { RouteA } from './RouteA';

import type { EventData, RecordEvent, RouteProps } from './SharedTypes';


const ROUTES: Array<NavRouteConfigItem> = [{
  routeKey: 'RouteA',
  routeOptionsDefault: {
    largeTitleDisplayMode: 'never',
  },
  renderRoute: () => (
    <RouteA/>
  ),
}];

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
      events: [...prevState.events, event],
    }));
  };

  _handleKeyExtractor = (item: EventData) => {
    return `${item.timestamp}`;
  };

  _renderEventListItem: ListRenderItem<EventData> = ({item, index}) => {
    return(
      <EventListItem
        index={index}
        eventListItem={item}
      />
    );
  };

  render(){
    const routeProps: RouteProps = {
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
          routes={ROUTES}
          initialRoutes={[{
            routeKey: 'RouteA',
            routeProps,
          }]}
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
