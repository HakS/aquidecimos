export default {
  title: "Signifier",
  name: "signifier",
  type: "document",
  fields: [{
    title: "Word or phrase",
    name: "writting",
    type: "string",
    validation: Rule => Rule.required()
  }]
}
