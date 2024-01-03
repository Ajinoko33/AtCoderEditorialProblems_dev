import { Layout } from 'antd';
import { HeaderMain } from './HeaderMain';
import { HeaderMenu } from './HeaderMenu';

export const Header = () => {
  const style = {
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    borderBottomColor: '#0505050F',
    borderBottomWidth: '2px',
    height: '3rem',
    padding: '0 2rem',
  };

  return (
    <Layout.Header style={style}>
      <HeaderMain />
      <HeaderMenu />
    </Layout.Header>
  );
};
