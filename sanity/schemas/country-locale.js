import countries from './countries'

export default {
  title: "Country locale",
  name: "country_locale",
  type: "object",
  fields: [{
    title: 'Country',
    name: 'country',
    type: 'string',
    options: {
      list: [
        ...countries
      ],
    }
  }, {
    title: "Locality",
    name: "locality",
    type: "string"
  }]
}