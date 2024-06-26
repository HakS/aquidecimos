export default {
  title: "Meaning",
  name: "meaning",
  type: "document",
  fields: [{
    title: "Signifier",
    name: "signifier",
    type: "string",
    validation: Rule => Rule.required()
  }, {
    title: "Signified",
    name: "signified",
    type: "reference",
    to: [{type: "signified"}],
    validation: Rule => Rule.required()
  }, {
    title: 'Countries',
    name: 'countries',
    type: 'array',
    of: [{
      type: 'country_locale'
    }]
  }, {
    title: 'Examples',
    name: 'examples',
    type: 'array',
    of: [
      {
        type: 'block'
      }
    ]
  }, {
    title: 'Tags',
    name: 'tags',
    type: 'array',
    of: [
      {
        type: 'string'
      }
    ]
  }]
}