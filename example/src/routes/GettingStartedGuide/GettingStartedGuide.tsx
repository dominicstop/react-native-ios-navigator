import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import type { RouteContentProps } from 'react-native-ios-navigator';

import { CardBody } from '../../components/ui/Card';

import { ExampleA01 } from './ExampleA01';
import { ExampleA02 } from './ExampleA02';
import { ExampleA03 } from './ExampleA03';
import { ExampleB03 } from './ExampleB03';
import { ExampleB04 } from './ExampleB04';
import { ExampleB05 } from './ExampleB05';
import { ExampleB06 } from './ExampleB06';


export const ExampleContainer: React.FC = (props) => {
  return(
    <CardBody style={{height: 300}}>
      {props.children}
    </CardBody>
  );
};

export function GettingStartedGuide(_: RouteContentProps){
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
      <ExampleContainer>
        <ExampleB03/>
      </ExampleContainer>
      <ExampleContainer>
        <ExampleB04/>
      </ExampleContainer>
      <ExampleContainer>
        <ExampleB05/>
      </ExampleContainer>
      <ExampleContainer>
        <ExampleB06/>
      </ExampleContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    paddingBottom: 75,
  },
});