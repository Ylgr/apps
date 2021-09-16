// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AddressIdentity } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { Judgements } from '@polkadot/app-accounts/Sidebar/Judgements';
import { AddressMini, AvatarItem, Expander, IconLink, Tag } from '@polkadot/react-components';
import { getJudgements } from '@polkadot/react-components/util/getJudgements';
import { useApi, useRegistrars, useSubidentities, useToggle } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';
import RegistrarJudgement from './RegistrarJudgement';
import UserIcon from './UserIcon';

interface Props {
  address: string;
  identity?: AddressIdentity;
}

const SUBS_DISPLAY_THRESHOLD = 4;

function Identity ({ address, identity }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isRegistrar, registrars } = useRegistrars();
  const [isJudgementOpen, toggleIsJudgementOpen] = useToggle();
  const subs = useSubidentities(address);

  const subsList = useMemo(() =>
    subs?.map((sub) =>
      <AddressMini
        className='subs'
        isPadded={false}
        key={sub.toString()}
        value={sub}
      />
    )
  , [subs]
  );

  if (!identity || !identity.isExistent || !api.query.identity?.identityOf) {
    return null;
  }

  const judgements = getJudgements(identity);

  return (
    <section
      className='withDivider'
      data-testid='identity-section'
    >
      <div className='ui--AddressMenu-section ui--AddressMenu-identity'>
        <div className='ui--AddressMenu-sectionHeader'>
          {t<string>('identity')}
          <Tag
            color={
              identity.isBad
                ? 'red'
                : identity.isGood
                  ? 'green'
                  : 'yellow'
            }
            isTag={false}
            label={
              <>
                <b>{identity.judgements.length}&nbsp;</b>
                {
                  identity.judgements.length
                    ? identity.isBad
                      ? identity.isErroneous
                        ? t<string>('Erroneous')
                        : t<string>('Low quality')
                      : identity.isKnownGood
                        ? t<string>('Known good')
                        : t<string>('Reasonable')
                    : t<string>('No judgments')
                }
              </>
            }
            size='tiny'
          />
        </div>
        <div>
          <AvatarItem
            icon={
              // This won't work - images are IPFS hashes
              // identity.image
              //   ? <img src={identity.image} />
              //   : <i className='icon user ui--AddressMenu-identityIcon' />
              //
              <UserIcon />
            }
            subtitle={identity.legal}
            title={identity.display}
          />
          <Judgements judgements={judgements} />
          <div className='ui--AddressMenu-identityTable'>
            {identity.parent && (
              <div className='tr parent'>
                <div className='th'>{t<string>('parent')}</div>
                <div className='td'>
                  <AddressMini
                    className='parent'
                    isPadded={false}
                    value={identity.parent}
                  />
                </div>
              </div>
            )}
            {identity.email && (
              <div className='tr'>
                <div className='th'>{t<string>('email')}</div>
                <div className='td'>
                  {isHex(identity.email) || !identity.isKnownGood
                    ? identity.email
                    : (
                      <a
                        href={`mailto:${identity.email as string}`}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {identity.email}
                      </a>
                    )}
                </div>
              </div>
            )}
            {identity.web && (
              <div className='tr'>
                <div className='th'>{t<string>('website')}</div>
                <div className='td'>
                  {isHex(identity.web) || !identity.isKnownGood
                    ? identity.web
                    : (
                      <a
                        href={(identity.web as string).replace(/^(https?:\/\/)?/g, 'https://')}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {identity.web}
                      </a>
                    )}
                </div>
              </div>
            )}
            {identity.twitter && (
              <div className='tr'>
                <div className='th'>{t<string>('twitter')}</div>
                <div className='td'>
                  {isHex(identity.twitter) || !identity.isKnownGood
                    ? identity.twitter
                    : (
                      <a
                        href={
                          (identity.twitter as string).startsWith('https://twitter.com/')
                            ? (identity.twitter as string)
                            : `https://twitter.com/${identity.twitter as string}`
                        }
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {identity.twitter}
                      </a>
                    )}
                </div>
              </div>
            )}
            {identity.riot && (
              <div className='tr'>
                <div className='th'>{t<string>('riot')}</div>
                <div className='td'>
                  {identity.riot}
                </div>
              </div>
            )}
            {!!subs?.length && (
              <div className='tr'>
                <div className='th top'>{t<string>('subs')}</div>
                <div
                  className='td'
                  data-testid='subs'
                >
                  {subs.length > SUBS_DISPLAY_THRESHOLD
                    ? (
                      <Expander summary={subs.length}>
                        {subsList}
                      </Expander>
                    )
                    : (
                      <>
                        <div className='subs-number'>{subs.length}</div>
                        {subsList}
                      </>
                    )
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isRegistrar && (
        <div className='ui--AddressMenu-section'>
          <div className='ui--AddressMenu-actions'>
            <ul>
              <li>
                <IconLink
                  icon='address-card'
                  label={t<string>('Add identity judgment')}
                  onClick={toggleIsJudgementOpen}
                />
              </li>
            </ul>
          </div>
        </div>
      )}
      {isJudgementOpen && isRegistrar && (
        <RegistrarJudgement
          address={address}
          key='modal-judgement'
          registrars={registrars}
          toggleJudgement={toggleIsJudgementOpen}
        />
      )}
    </section>
  );
}

export default React.memo(Identity);
