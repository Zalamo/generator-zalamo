/* 3rd party modules */
import { ApolloAction } from 'apollo-client/actions';

/**
 * Function that gets the name off the ApolloAction by operationName or document definitions as a fallback.
 *
 * @param action The ApolloAction object
 * @returns Name of the action
 */
export function apolloOperationName(action: ApolloAction): string {
  return action['operationName'] || action['document'].definitions[ 0 ].name.value;
}
