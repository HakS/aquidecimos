export default {
  title: "Signified",
  name: "signified",
  type: "document",
  fields: [{
    title: "Signifier",
    name: "signifier",
    type: "string",
    validation: Rule => Rule.required()
  }, {
    title: "Definition",
    name: "definition",
    type: "text"
  }, {
    title: "Type",
    name: "type",
    type: "string",
    validation: Rule => Rule.required(),
    options: {
      list: [
        {title: 'Sustantivo', value: 'noun'},
        {title: 'Adjetivo', value: 'adjective'},
        {title: 'Adverbio', value: 'adverbio'},
        {title: 'Verbo', value: 'verb'},
        {title: 'Acción', value: 'action'},
      ],
    },
  }, {
    title: "Derivative of",
    name: "derivative_of",
    type: "reference",
    to: [{type: 'signified'}],
  }]
}
