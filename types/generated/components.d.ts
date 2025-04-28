import type { Schema, Struct } from '@strapi/strapi';

export interface ApiIzbrannoe extends Struct.ComponentSchema {
  collectionName: 'components_api_izbrannoe';
  info: {
    displayName: '\u0438\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435';
    icon: 'alien';
  };
  attributes: {
    date: Schema.Attribute.Date;
    masters: Schema.Attribute.Relation<'oneToMany', 'api::master.master'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'api.izbrannoe': ApiIzbrannoe;
    }
  }
}
