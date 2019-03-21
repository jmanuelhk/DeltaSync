/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import Login from "./data";
// import GetPost from "./getPost";
import { Rehydrated } from "aws-appsync-react";
import { ApolloProvider as Provider} from "react-apollo";
import appSyncConfig from "./AppSync";
import { AsyncStorage } from "react-native";
import {
  BaseQuery,
GetItem,
Subscription,
DeltaSync
} from './graphql';
import AWSAppSyncClient, { buildSync } from 'aws-appsync';
import Amplify, {Auth} from 'aws-amplify';
import awsmobile from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native'; // or 'aws-amplify-react-native';

Amplify.configure(awsmobile);


const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  // auth: {
  //   type: appSyncConfig.authenticationType,
  //   apiKey: appSyncConfig.apiKey,
  //   // jwtToken: async () => token, // Required when you use Cognito UserPools OR OpenID Connect. token object is obtained previously
  // },
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  offlineConfig: {
    storage: AsyncStorage,
    callback: (err, succ) => {
      if (err) {
        const { mutation, variables } = err;

        Alert.alert(`Offline Callback Error`, JSON.stringify(err));
      } else {
        const { mutation, variables } = succ;

        Alert.alert(`Offline Callback Success`, JSON.stringify(succ));
      }
    },
  },
  disableOffline: false,
});

client.hydrated().then(() =>
  client.sync(
    buildSync("Post", {
      baseQuery: {
        query: BaseQuery
      },
      subscriptionQuery: {
        query: Subscription
      },
      deltaQuery: {
        query: DeltaSync
      },
      // cacheUpdates: ( deltaRecord  ) => {
      //   console.log(deltaRecord)
      // }

      // cacheUpdates: ({ id }) => [
      //   { query: DeltaSync.GetItem, variables: { id } }
      // ]
    })
  )
);

const WithProvider = () => (
  <Provider client={client}>
      <Rehydrated>
         <Login />
      </Rehydrated>
    </Provider>
);

// export default WithProvider;
export default withAuthenticator(WithProvider, true);
