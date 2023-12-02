import { ReactElement, useState } from 'react';
import { ArrowBack, Layout, ServerOnline } from '../../common';

import { ResetCodeForm } from './Forms/ResetCodeForm';
import { PasswordChangeForm } from './Forms/PasswordChangeForm';

export function ForgotPassword(): ReactElement {
  const [readyForChange, setReadyForChange] = useState(false);
  const [email, setEmail] = useState<string>('');

  return (
    <Layout mainBackground="bg-login-bg">
      <ArrowBack position="absolute left-0 top-0" />
      <div className="flex h-full flex-col items-center justify-end">
        <div className="flex h-full max-h-[365px] items-center gap-8">
          <ResetCodeForm
            setReadyForReset={setReadyForChange}
            email={email}
            setEmail={setEmail}
          />
          {readyForChange ? <PasswordChangeForm email={email} /> : null}
        </div>
        <div className="flex flex-col items-center justify-end">
          <ServerOnline />
        </div>
      </div>
    </Layout>
  );
}
