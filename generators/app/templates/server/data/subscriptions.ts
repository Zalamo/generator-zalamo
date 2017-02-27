import { PubSub, SubscriptionManager } from 'graphql-subscriptions';
import schema from './schema';

const pubsub = new PubSub();
const setupFunctions = {};
const subscriptionManager = new SubscriptionManager({ setupFunctions, schema, pubsub });

export { subscriptionManager, pubsub };
