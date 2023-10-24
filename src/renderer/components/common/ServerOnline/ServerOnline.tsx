import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getServerOnline } from '../../../redux';
import logo from '../../../../../assets/icons/logo-big.svg';

type Props = {
  hasIcon?: boolean;
};

export function ServerOnline(props: Props): ReactElement {
  const { hasIcon = true } = props;
  const { t } = useTranslation();
  const serverOnline = useSelector(getServerOnline);

  return (
    <>
      {hasIcon ? <img src={logo} alt="wardsculks" /> : null}
      <p className="text-center">
        {/**
         * if we will have multiple servers in future, we will need to sum online from all servers of remove this
         */}
        {t('ONLINE')} <span className="glow-text">{serverOnline}</span>
      </p>
    </>
  );
}
