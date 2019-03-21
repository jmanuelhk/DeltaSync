import gql from "graphql-tag";
import { graphql } from "react-apollo";

//Declare you GraphQL documents below
export const BaseQuery = gql`query Base{
  listPosts {
    id
    title
    author
    content
  }
}`;

export const GetItem = gql`query GetItem($id: ID!){
  getPost(id: $id) {
    id
    title
    author
    content
  }
}`;

export const Subscription = gql`subscription Subscription {
  onDeltaPost {
    id
    title
    author
    content
  }
}`;

export const DeltaSync = gql`query Delta($lastSync: AWSTimestamp!) {
  listPostsDelta(
    lastSync: $lastSync
  ) {
    id
    title
    author
    content
    aws_ds
  }
}`;

//Declare your React Component level operations below
export const operations = {
  FetchPosts: graphql(BaseQuery, {
    options: {
      fetchPolicy: "cache-only"
    },
    props: ({ data }) => {
      return {
        loading: data.loading,
        posts: data.listPosts
        // posts: data.allChannel
      };
    }
  })
};
