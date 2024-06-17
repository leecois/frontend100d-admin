import { EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslate } from '@refinedev/core';
import { Card, List, Typography } from 'antd';
import React from 'react';

import type { IUser } from '../../../interfaces';
import { UserStatus } from '../userStatus';

type Props = {
  customer?: IUser;
};

export const CustomerInfoList = ({ customer }: Props) => {
  const t = useTranslate();

  return (
    <Card
      bordered={false}
      bodyStyle={{
        padding: '0 16px 0 16px',
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: t('users.fields.status.label'),
            icon: <UserOutlined />,
            value: <UserStatus value={customer?.isAdmin || false} />,
          },
          // Add other fields as necessary
          {
            title: t('users.fields.email'),
            icon: <EnvironmentOutlined />,
            value: <Typography.Text>{customer?.email}</Typography.Text>,
          },
          {
            title: t('users.fields.YOB'),
            icon: <EnvironmentOutlined />,
            value: <Typography.Text>{customer?.YOB}</Typography.Text>,
          },
          {
            title: t('users.fields.membername.label'),
            icon: <EnvironmentOutlined />,
            value: <Typography.Text>{customer?.membername}</Typography.Text>,
          },
        ]}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={item.icon}
              title={
                <Typography.Text type="secondary">{item.title}</Typography.Text>
              }
              description={item.value}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
