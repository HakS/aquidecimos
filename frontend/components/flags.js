import spanishCountryLabels from '../spanishCountryLabels'
import { Tooltip } from '../utils';
import { ReactCountryFlag } from 'react-country-flag';

const Flags = ({countries}) => {
  return (
    <>
      {countries.map(country => (
        <Tooltip
        data-tip={`${spanishCountryLabels[country.country]}${country.locality ? ` (${country.locality})` : ''}`}
        key={country.country}>
          <ReactCountryFlag countryCode={country.country}
          svg
          aria-label={spanishCountryLabels[country.country]}
          alt={spanishCountryLabels[country.country]}
          style={{
            width: '1.3em',
            height: '1.3em',
          }} />
        </Tooltip>
      ))}
    </>
  )
}

export default Flags