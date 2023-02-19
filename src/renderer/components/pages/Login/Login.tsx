import { ReactElement } from 'react';
import { Button, Checkbox, Frame, Input, Layout } from '../../common';
import logo from '../../../../../assets/icons/logo-big.svg';

export function Login(): ReactElement {
  return (
    <Layout mainBackground="bg-login-main" sideBackground="bg-start-sides">
      <div className="ml-[48px] flex h-full items-center gap-10">
        <Frame className="max-w-[245px] px-7 py-10">
          <div className="flex-center-col">
            <h1 className="text-lg">Вхід</h1>
            <Input
              placeholder="Логін"
              type="text"
              className="mt-2 w-full text-sm"
            />
            <Input
              placeholder="Пароль"
              type="password"
              className="mt-4 w-full text-sm"
            />

            <div className="mt-6 w-full text-sm">
              <label className="flex">
                <Checkbox className="mr-2" />
                <span className="flex flex-row items-center text-sm">
                  Зберегти пароль
                </span>
              </label>
              <a
                className="hover:glow-text mt-2"
                href="https://github.com/Ward-Sculks"
              >
                Забули пароль?
              </a>
            </div>

            <Button
              title="Увійти"
              className="hover:glow-text my-[30px] px-[46px] pt-2 text-20"
            />

            <div className="text-sm">
              <p>Немаєте аккаунту?</p>
              <p>
                <a
                  className="hover:glow-text"
                  href="https://github.com/Ward-Sculks"
                >
                  Зареєструватись
                </a>
              </p>
            </div>
          </div>
        </Frame>
        <div className="flex h-full flex-col items-center justify-end">
          <img src={logo} alt="wardsculks" />
          <p className="text-center">
            Онлайн: <span className="glow-text">256</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
