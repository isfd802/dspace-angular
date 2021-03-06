import { ResourceType } from './resource-type';

/**
 * The resource type for ItemRequest.
 *
 * Needs to be in a separate file to prevent circular
 * dependencies in webpack.
 */
export const ITEM_REQUEST = new ResourceType('itemrequest');
