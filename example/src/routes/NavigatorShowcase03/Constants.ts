
import * as Helpers    from '../../functions/Helpers';
import * as LorumIpsum from '../../constants/LorumIpsum';


export enum ListItemType {
  abc = 'abc',
  def = 'def',
  ghi = 'ghi',
  jkl = 'jkl',
  mno = 'mno',
  pqr = 'pqr',
};

export type ListItemObject = {
  id: number;
  itemType: ListItemType | `${ListItemType}`;
  title: string;
  subtitle: string;
};

export const ITEM_TYPES_LIST = 
  Object.keys(ListItemType) as Array<`${ListItemType}`>


let ID_COUNTER = 0;


function generateRandomItem(): ListItemObject {
  return {
    id: ID_COUNTER++,
    title: LorumIpsum.randomTitle({minLength: 2, maxLength: 4}),
    subtitle: LorumIpsum.randomSentence({minLength: 7, maxLength: 20}),
    itemType: Helpers.randomElement(ITEM_TYPES_LIST),
  };
};

function generateListItems(): ListItemObject[] {
  let items: ListItemObject[] = [];

  for (let i = 0; i < 35; i++) {
    items.push(generateRandomItem())
  };

  return items;
};

export const LIST_ITEMS: ListItemObject[] = generateListItems();

export const UI_CONSTANTS = {
  menuItemHeight: 40,
  menuExpandedHeight: 0,
};

UI_CONSTANTS.menuExpandedHeight = 
  UI_CONSTANTS.menuItemHeight * ITEM_TYPES_LIST.length;