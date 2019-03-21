/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { GetItem } from './graphql';
import { graphql } from "react-apollo";


const OnePost = ({ post }) => (
  <View>
    <Text>{JSON.stringify(post, null, 2)}</Text>
  </View>
);

export default graphql(GetItem, {
  options: ({ id }) => ({
    variables: { id },
    fetchPolicy: "cache-only"
  }),
  props: ({ data: { getPost } }) => ({
    post: getPost
  })
})(OnePost);
