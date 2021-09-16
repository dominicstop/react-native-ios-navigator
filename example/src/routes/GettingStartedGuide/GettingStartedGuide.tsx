import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import type { RouteContentProps } from 'react-native-ios-navigator';

import { CardBody } from '../../components/ui/Card';

import { ExampleA01 } from './ExampleA01';
import { ExampleA02 } from './ExampleA02';
import { ExampleA03 } from './ExampleA03';


export const ExampleContainer: React.FC = (props) => {
  return(
    <CardBody style={{height: 300}}>
      {props.children}
    </CardBody>
  );
};

export function GettingStartedGuide(props: RouteContentProps){
  return(
    <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
      <ExampleContainer>
        <ExampleA01/>
      </ExampleContainer>
      <ExampleContainer>
        <ExampleA02/>
      </ExampleContainer>
      <ExampleContainer>
        <ExampleA03/>
      </ExampleContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    paddingBottom: 75,
  },
});