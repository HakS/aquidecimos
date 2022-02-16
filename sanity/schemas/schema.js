import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import signified from './signified'
import signifier from './signifier'
import meaning from './meaning'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    signified,
    signifier,
    meaning
  ]),
})
