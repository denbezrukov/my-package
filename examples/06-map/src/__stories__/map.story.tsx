import React from 'react';
import { storiesOf } from '@storybook/react';
import { number, select, withKnobs } from '@storybook/addon-knobs';
import { Map } from '../map';

storiesOf('Map', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const width = number('width', 650);
    const builtInProjections = ['geoAzimuthalEqualArea', 'geoAzimuthalEquidistant', 'geoGnomonic', 'geoOrthographic', 'geoStereographic', 'geoEqualEarth', 'geoAlbersUsa', 'geoAlbers', 'geoConicConformal', 'geoConicEqualArea', 'geoConicEquidistant', 'geoEquirectangular', 'geoMercator', 'geoTransverseMercator', 'geoNaturalEarth1'];
    const geoProjectionProjections = ['geoAiry', 'geoAitoff', 'geoAlbers', 'geoArmadillo', 'geoAugust', 'geoAzimuthalEqualArea', 'geoAzimuthalEquidistant', 'geoBaker', 'geoBerghaus', 'geoBertin1953', 'geoBoggs', 'geoBonne', 'geoBottomley', 'geoBromley', 'geoChamberlin', 'geoChamberlinAfrica', 'geoCollignon', 'geoConicConformal', 'geoConicEqualArea', 'geoConicEquidistant', 'geoCraig', 'geoCraster', 'geoCylindricalEqualArea', 'geoCylindricalStereographic', 'geoEckert1', 'geoEckert2', 'geoEckert3', 'geoEckert4', 'geoEckert5', 'geoEckert6', 'geoEisenlohr', 'geoEquirectangular', 'geoFahey', 'geoFoucaut', 'geoFoucautSinusoidal', 'geoGilbert', 'geoGingery', 'geoGinzburg4', 'geoGinzburg5', 'geoGinzburg6', 'geoGinzburg8', 'geoGinzburg9', 'geoGnomonic', 'geoGringorten', 'geoGuyou', 'geoHammer', 'geoHammerRetroazimuthal', 'geoHealpix', 'geoHill', 'geoHomolosine', 'geoHufnagel', 'geoHyperelliptical', 'geoKavrayskiy7', 'geoLagrange', 'geoLarrivee', 'geoLaskowski', 'geoLittrow', 'geoLoximuthal', 'geoMercator', 'geoMiller', 'geoModifiedStereographic', 'geoModifiedStereographicAlaska', 'geoModifiedStereographicGs48', 'geoModifiedStereographicGs50', 'geoModifiedStereographicMiller', 'geoModifiedStereographicLee', 'geoMollweide', 'geoMtFlatPolarParabolic', 'geoMtFlatPolarQuartic', 'geoMtFlatPolarSinusoidal', 'geoNaturalEarth1', 'geoNaturalEarth2', 'geoNellHammer', 'geoNicolosi', 'geoOrthographic', 'geoPatterson', 'geoPolyconic', 'geoRectangularPolyconic', 'geoRobinson', 'geoSatellite', 'geoSinusoidal', 'geoSinuMollweide', 'geoStereographic', 'geoTimes', 'geoTransverseMercator', 'geoTwoPointAzimuthal', 'geoTwoPointAzimuthalUsa', 'geoTwoPointEquidistant', 'geoTwoPointEquidistantUsa', 'geoVanDerGrinten', 'geoVanDerGrinten2', 'geoVanDerGrinten3', 'geoVanDerGrinten4', 'geoWagner', 'geoWagner4', 'geoWagner6', 'geoWagner7', 'geoWiechel', 'geoWinkel3', 'geoInterrupt', 'geoInterruptedHomolosine', 'geoInterruptedSinusoidal', 'geoInterruptedBoggs', 'geoInterruptedSinuMollweide', 'geoInterruptedMollweide', 'geoInterruptedMollweideHemispheres', 'geoPolyhedral', 'geoPolyhedralButterfly', 'geoPolyhedralCollignon', 'geoPolyhedralWaterman', 'geoQuincuncial', 'geoGringortenQuincuncial', 'geoPeirceQuincuncial'];
    const projections = [
      ...builtInProjections,
      ...geoProjectionProjections,
    ];
    const options = Object.fromEntries(projections.map(v => ([v, v])));
    const field = select('Projection', options, projections[0]);

    return (
      <Map
        width={width}
        projection={field}
      />
    );
  });
