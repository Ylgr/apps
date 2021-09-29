// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { typesChain } from '@phala/typedefs';

import CrustMaxwell from './crust-maxwell';
import cloverTypes from './clover';

// alphabetical, based on the actual displayed name
export default {
  ...typesChain,
  'Crust Maxwell': CrustMaxwell,
  'Development': cloverTypes,
  'bein': cloverTypes,
  'Bein': cloverTypes,
};
