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

export interface ApiOtklikiMasterov extends Struct.ComponentSchema {
  collectionName: 'components_api_otkliki_masterov';
  info: {
    description: '';
    displayName: '\u041E\u0442\u043A\u043B\u0438\u043A\u0438 \u043C\u0430\u0441\u0442\u0435\u0440\u043E\u0432';
    icon: 'bell';
  };
  attributes: {
    clientChoice: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    master: Schema.Attribute.Relation<'oneToOne', 'api::master.master'>;
    price: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'api.izbrannoe': ApiIzbrannoe;
      'api.otkliki-masterov': ApiOtklikiMasterov;
    }
  }
}
