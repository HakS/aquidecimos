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
    title: "Derivative of",
    name: "derivative_of",
    type: "reference",
    to: [{type: 'signified'}],
  }]
}
