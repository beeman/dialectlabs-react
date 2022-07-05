import { useDapp } from '@dialectlabs/react-sdk';
import {
  useDialectWallet,
  useDialectConnectionInfo,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import NoConnectionError from '../../entities/errors/ui/NoConnectionError';
import NoWalletError from '../../entities/errors/ui/NoWalletError';
import EncryptionInfo from '../../entities/wallet-states/EncryptionInfo';
import SignMessageInfo from '../../entities/wallet-states/SignMessageInfo';
import { Centered } from '../common';
import { A } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';
import BroadcastForm from './BroadcastForm';

interface WalletStateWrapperProps {
  children?: React.ReactNode;
}

function WalletStateWrapper({
  children,
}: WalletStateWrapperProps): JSX.Element {
  const {
    connected: {
      solana: {
        connected: isSolanaConnected,
        shouldConnect: isSolanaShouldConnect,
      },
      dialectCloud: {
        connected: isDialectCloudConnected,
        shouldConnect: isDialectCloudShouldConnect,
      },
    },
  } = useDialectConnectionInfo();

  const {
    isSigning,
    isEncrypting,
    connected: isWalletConnected,
  } = useDialectWallet();

  const someBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  if (!isWalletConnected) {
    return (
      <NoWalletError
        message={
          <>
            Connect your Dapp’s wallet to create
            <br />
            broadcast notifications
          </>
        }
      />
    );
  }

  if (!someBackendConnected) {
    return <NoConnectionError />;
  }

  if (isSigning) {
    return <SignMessageInfo />;
  }

  if (isEncrypting) {
    return <EncryptionInfo />;
  }

  return <>{children}</>;
}

function InnerBroadcast() {
  const {
    dapp,
    isFetching: isFetchingDapp,
    errorFetching: errorFetchingDapp,
  } = useDapp();

  if (errorFetchingDapp) {
    return (
      <Centered className="dt-text-center">
        Fetching dapps failed: {errorFetchingDapp.message}
      </Centered>
    );
  }

  if (isFetchingDapp) {
    return <Centered>Loading your dapps...</Centered>;
  }

  if (!dapp) {
    return (
      <Centered>
        <span>
          This wallet is not eligible for broadcasting, <br />
          contact us through twitter
          <A href="https://twitter.com/saydialect" target="_blank">
            @saydialect
          </A>
        </span>
      </Centered>
    );
  }

  return <BroadcastForm dapp={dapp} />;
}

const Wrapper = (props) => {
  const { textStyles, colors } = useTheme();
  return (
    <div
      className={clsx(
        textStyles.body,
        colors.primary,
        colors.bg,
        'dt-h-full dt-min-h-[515px] dt-p-4'
      )}
      {...props}
    />
  );
};

function Broadcast() {
  return (
    <Wrapper>
      <WalletStateWrapper>
        <InnerBroadcast />
      </WalletStateWrapper>
    </Wrapper>
  );
}

export default Broadcast;
