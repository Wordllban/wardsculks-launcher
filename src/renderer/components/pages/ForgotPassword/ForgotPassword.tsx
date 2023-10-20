import { ReactElement } from 'react';
import { ArrowBack, Frame, Layout } from '../../common';

export function ForgotPassword(): ReactElement {
  return (
    <Layout mainBackground="bg-login-bg">
      <ArrowBack position="absolute left-0 top-0" />
      <div className="flex h-full items-center justify-center">
        <Frame className="flex items-center justify-center">
          <div className="p-8">
            <h1 className="text-3xl text-main">У розробці...</h1>
            <div>
              Якщо ви забули пароль -
              <br /> зв&apos;яжіться з адміністрацією у Discord сервері.
            </div>
          </div>
        </Frame>
      </div>
    </Layout>
  );
}
