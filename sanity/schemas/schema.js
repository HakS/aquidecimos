import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import signified from './signified'
import meaning from './meaning'
import countryLocale from './country-locale'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    countryLocale,
    signified,
    meaning
  ]),
})
