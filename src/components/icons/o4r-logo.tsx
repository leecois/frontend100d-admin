import { Space, Typography } from 'antd';
import type React from 'react';

import { Logo } from './logo';

export const O4RLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Logo {...props} />
);

export const O4RLogoText: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  const { Text } = Typography;
  return (
    <Space direction="vertical">
      <Text code>MY WATCH STORE</Text>
    </Space>
  );
};
