import type { MenuFixture } from '../types/order.types';

export const MENU_FIXTURE: MenuFixture = {
  productName: 'Build Your Breakfast',
  currency: 'BDT',
  basePrice: 250,
  groups: [
    {
      id: 'bread',
      name: 'Bread',
      limits: {
        min: 1,
        max: 1,
      },
      options: [
        { id: 'toast', name: 'Toast', price: 0, ingredients: { toast: 1 } },
        { id: 'paratha', name: 'Paratha', price: 20, ingredients: { paratha: 1 } },
        { id: 'croissant', name: 'Croissant', price: 60, ingredients: { croissant: 1 } },
      ],
    },
    {
      id: 'eggs',
      name: 'Eggs',
      limits: {
        min: 2,
        max: 6,
        step: 2,
      },
      options: [
        { id: 'fried', name: 'Fried', price: 30, ingredients: { egg: 1 } },
        { id: 'scrambled', name: 'Scrambled', price: 35, ingredients: { egg: 1 } },
        { id: 'omelette', name: 'Omelette', price: 70, ingredients: { egg: 2 } },
      ],
    },
    {
      id: 'protein',
      name: 'Protein',
      limits: {
        min: 1,
        max: 3,
      },
      options: [
        { id: 'sausage', name: 'Chicken Sausage', price: 60, ingredients: { sausage: 1 } },
        { id: 'bacon', name: 'Beef Bacon', price: 90, ingredients: { bacon: 1 } },
        { id: 'tofu', name: 'Tofu', price: 50, ingredients: { tofu: 1 } },
      ],
    },
    {
      id: 'extras',
      name: 'Extras',
      limits: {
        min: 0,
        max: 4,
      },
      options: [
        { id: 'hashbrown', name: 'Hash Brown', price: 40, ingredients: { hashbrown: 1 } },
        { id: 'mushroom', name: 'Mushroom', price: 30, ingredients: { mushroom: 1 } },
        { id: 'beans', name: 'Baked Beans', price: 25, ingredients: { beans: 1 } },
        { id: 'cheese', name: 'Cheese', price: 35, ingredients: { cheese: 1 } },
      ],
    },
    {
      id: 'sauce',
      name: 'Sauce',
      limits: {
        min: 0,
        maxDistinct: 2,
        maxPerOption: 1,
      },
      options: [
        { id: 'ketchup', name: 'Ketchup', price: 0, ingredients: {} },
        { id: 'hollandaise', name: 'Hollandaise', price: 25, ingredients: { hollandaise: 1 } },
        { id: 'chili', name: 'Chili', price: 10, ingredients: {} },
      ],
    },
  ],
  rules: [
    {
      id: 'R1',
      type: 'requires',
      targetOptionId: 'hollandaise',
      requiredOneOf: ['scrambled', 'omelette'],
      description: 'Hollandaise requires at least one of [Scrambled, Omelette]',
    },
    {
      id: 'R2',
      type: 'excludes',
      targetOptionId: 'tofu',
      excludedOptions: ['sausage', 'bacon'],
      description: 'Tofu excludes [Chicken Sausage, Beef Bacon]',
    },
    {
      id: 'R3',
      type: 'overrideLimit',
      targetOptionId: 'croissant',
      targetGroupId: 'extras',
      overrideLimits: { max: 2 },
      description: 'If Croissant is selected, Extras max = 2',
    },
    {
      id: 'R4',
      type: 'excludes',
      targetOptionId: 'chili',
      excludedOptions: ['hollandaise'],
      description: 'Chili excludes [Hollandaise]',
    },
  ],
  initialStock: {
    egg: 10,
    sausage: 4,
    bacon: 3,
    tofu: 5,
    croissant: 2,
    paratha: 10,
    toast: 20,
    hashbrown: 6,
    mushroom: 6,
    beans: 8,
    cheese: 4,
    hollandaise: 5,
  },
};
