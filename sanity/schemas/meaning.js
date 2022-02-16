import countries from './countries'

export default {
  title: "Meaning",
  name: "meaning",
  type: "document",
  fields: [{
    title: "Signifier",
    name: "signifier",
    type: "reference",
    to: [{type: "signifier"}],
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
      type: 'string',
      options: {
        list: [
          ...countries
        ],
      }
    }]
  }]
}