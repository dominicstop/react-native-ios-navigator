import * as React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { RouteContentProps, RouteViewEvents } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardButton } from '../../components/ui/Card';

import { SearchEventsListItem } from './SearchEventsListItem';
import type { RecordSearchEvent, SearchEventData } from './SharedTypes';

import * as Helpers from '../../functions/Helpers';
import * as Colors from '../../constants/Colors';


type SearchEventsListState = {
  events: Array<SearchEventData>;
};

export class SearchEventsList extends React.Component<RouteContentProps, SearchEventsListState> {
  
  constructor(props: RouteContentProps){
    super(props);

    this.state = {
      events: [],
    };
  };

  recordEvent: RecordSearchEvent = (event) => {
    this.setState((prevState) => ({
      events: [event, ...prevState.events],
    }));
  };

  _renderList(){
    const events = this.state.events;
    const eventCount = events.length;

    const eventsTruncated = 
      events.slice(Math.max(events.length - 15, 0));

    const isEventsEmpty = eventCount === 0;
    
    return isEventsEmpty? (
      <View style={[styles.list, styles.listEmpty]}>
        <Text style={styles.labelListEmpty}>
          {'No Events to Display...'}
        </Text>
      </View>
    ):(
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
      >
        {eventsTruncated.map((item, index) => (
          <SearchEventsListItem
            key={`item-${item.eventType}-${item.timestamp}`}
            index={(eventCount - 1) - index}
            eventListItem={item}
          />
        ))}
      </ScrollView>
    );
  };

  render(){
    return(
      <React.Fragment>
        <RouteViewEvents
          onUpdateSearchResults={({nativeEvent}) => {
            this.recordEvent({
              eventType: 'onUpdateSearchResults',
              timestamp: Date.now(),
              text: nativeEvent.text,
              isActive: nativeEvent.isActive,
            });
          }}
          onSearchBarCancelButtonClicked={() => {
            this.recordEvent({
              eventType: 'onSearchBarCancelButtonClicked',
              timestamp: Date.now(),
            });
          }}
          onSearchBarSearchButtonClicked={({nativeEvent}) => {
            this.recordEvent({
              eventType: 'onSearchBarSearchButtonClicked',
              timestamp: Date.now(),
              text: nativeEvent.text,
            });
          }}
          onWillDismissSearchController={({nativeEvent}) => {
            this.recordEvent({
              eventType: 'onWillDismissSearchController',
              timestamp: Date.now(),
              text: nativeEvent.text,
            });
          }}
          onDidDismissSearchController={({nativeEvent}) => {
            this.recordEvent({
              eventType: 'onDidDismissSearchController',
              timestamp: Date.now(),
              text: nativeEvent.text,
            });
          }}
          onWillPresentSearchController={({nativeEvent}) => {
            this.recordEvent({
              eventType: 'onWillPresentSearchController',
              timestamp: Date.now(),
              text: nativeEvent.text,
            });
          }}
          onDidPresentSearchController={({nativeEvent}) => {
            this.recordEvent({
              eventType: 'onDidPresentSearchController',
              timestamp: Date.now(),
              text: nativeEvent.text,
            });
          }}
        />
        
        <CardBody>
          <CardTitle
            title={'Search Events'}
            subtitle={`Will list the last recent 15 events...`}
          />
          {this._renderList()}
          <CardButton
            title={`Clear Event List'`}
            subtitle={`Clear all items from list`}
            onPress={() => {
              this.setState({
                events: [],
              });
            }}
          />
        </CardBody>
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  list: {
    height: 250,
    marginTop: 10,
    backgroundColor: Helpers.hexToRGBA(Colors.INDIGO[100], 0.5),
    borderRadius: 10,
  },
  listEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  labelListEmpty: {
    color: 'rgba(0,0,0,0.3)',
    fontWeight: '600',
    fontSize: 16,
  },
}); 