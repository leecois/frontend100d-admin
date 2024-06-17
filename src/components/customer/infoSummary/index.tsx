import { Flex, Typography } from 'antd';

import type { IUser } from '../../../interfaces';

type Props = {
  customer?: IUser;
};

export const CustomerInfoSummary = ({ customer }: Props) => {
  return (
    <Flex align="center" gap={32}>
      <Flex vertical>
        <Typography.Text type="secondary">#{customer?._id}</Typography.Text>
        <Typography.Title
          level={3}
          style={{
            margin: 0,
          }}
        >
          {customer?.membername}
        </Typography.Title>
      </Flex>
    </Flex>
  );
};
